"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function normalizeUniversityId(value: string) {
  return value.trim();
}

function validateDescriptorArray(descriptorArray: number[]) {
  if (!Array.isArray(descriptorArray) || descriptorArray.length === 0) {
    throw new Error("Face template is missing.");
  }

  const hasInvalidValue = descriptorArray.some(
    (value) => typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value),
  );

  if (hasInvalidValue) {
    throw new Error("Face template contains invalid numeric values.");
  }
}

async function getAuthenticatedRole() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Unauthorized");
  }

  return {
    userId: user.id,
    role: profile.role,
  };
}

async function requireInstructorOrAdmin() {
  const auth = await getAuthenticatedRole();

  if (auth.role !== "instructor" && auth.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return auth;
}

export async function enrollStudentFaceAction(universityId: string, descriptorArray: number[]) {
  await requireInstructorOrAdmin();
  const normalizedUniversityId = normalizeUniversityId(universityId);

  if (!/^\d{8}$/.test(normalizedUniversityId)) {
    throw new Error("University ID must be exactly 8 digits.");
  }

  validateDescriptorArray(descriptorArray);

  const admin = createAdminClient();
  
  // 0. Lookup the profile_id using the 8-digit university_id
  const { data: profileData, error: profileErr } = await admin
    .from("profiles")
    .select("id")
    .eq("university_id", normalizedUniversityId)
    .maybeSingle();

  if (profileErr || !profileData) {
    throw new Error("No student found with that 8-digit University ID.");
  }

  const studentProfileId = profileData.id;

  // 1. Get the face_profile_id for the given studentProfileId
  const { data: faceProfile, error: fpError } = await admin
    .from("face_profiles")
    .select("id")
    .eq("profile_id", studentProfileId)
    .maybeSingle();

  if (fpError || !faceProfile) {
    throw new Error("Face profile not found for this user.");
  }

  // 2. Upload descriptor to Storage
  const path = `${faceProfile.id}/template.json`;
  const { error: uploadError } = await admin.storage
    .from("face-templates")
    .upload(path, JSON.stringify(descriptorArray), {
      contentType: "application/json",
      upsert: true,
    });

  if (uploadError) {
    throw new Error("Failed to upload face template.");
  }

  // 3. Upsert into face_templates table
  const { error: vtError } = await admin
    .from("face_templates")
    .upsert({
      face_profile_id: faceProfile.id,
      storage_object_path: path,
      template_version: 'face-api-ssd',
    }, { onConflict: "face_profile_id" });

  if (vtError) {
    throw new Error("Failed to link face template.");
  }

  // 4. Update face_profiles enrollment_status
  const { error: updateError } = await admin
    .from("face_profiles")
    .update({ enrollment_status: "complete", last_enrolled_at: new Date().toISOString() })
    .eq("id", faceProfile.id);

  if (updateError) {
    throw new Error("Failed to update enrollment status.");
  }

  return { success: true };
}

export async function getCourseFaceTemplatesAction(courseId: string) {
  const normalizedCourseId = courseId.trim();
  if (!normalizedCourseId) {
    throw new Error("Course is required.");
  }

  const auth = await requireInstructorOrAdmin();
  const supabase = createClient();

  if (auth.role !== "admin") {
    const { data: isInstructor } = await supabase.rpc("is_instructor_for_course", {
      course_id: normalizedCourseId,
    });
    if (!isInstructor) {
      throw new Error("Not an instructor for this course.");
    }
  }

  const admin = createAdminClient();

  const { data: enrollments } = await admin
    .from("course_enrollments")
    .select("student_profile_id")
    .eq("course_id", normalizedCourseId)
    .eq("status", "active");

  if (!enrollments || enrollments.length === 0) return [];

  const studentIds = enrollments.map(e => e.student_profile_id);

  // We fetch profiles and full_name so we return full_name along with descriptor
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, face_profiles(id, enrollment_status, face_templates(storage_object_path))")
    .in("id", studentIds);

  if (!profiles) return [];

  const templates = [];
  for (const prof of profiles) {
    const faceProf = Array.isArray(prof.face_profiles) ? prof.face_profiles[0] : prof.face_profiles;
    if (faceProf && faceProf.enrollment_status === 'complete') {
      const faceTpl = Array.isArray(faceProf.face_templates) ? faceProf.face_templates[0] : faceProf.face_templates;
      if (faceTpl && faceTpl.storage_object_path) {
        const { data: fileData } = await admin.storage
          .from("face-templates")
          .download(faceTpl.storage_object_path);

        if (fileData) {
          const text = await fileData.text();
          const descriptorArray = JSON.parse(text);
          templates.push({
            studentProfileId: prof.id,
            fullName: prof.full_name || "Unknown",
            descriptorArray,
          });
        }
      }
    }
  }

  return templates;
}

export async function markAttendanceAction(courseId: string, studentProfileId: string, confidenceScore: number) {
   const normalizedCourseId = courseId.trim();
   const normalizedStudentProfileId = studentProfileId.trim();
   if (!normalizedCourseId || !normalizedStudentProfileId) {
     throw new Error("Course and student are required.");
   }

   await requireInstructorOrAdmin();

   const boundedConfidence = Math.max(0, Math.min(1, confidenceScore));
   const supabase = createClient();

   const { data: session } = await supabase
     .from("attendance_sessions")
     .select("id")
     .eq("course_id", normalizedCourseId)
     .eq("status", "open")
     .maybeSingle();

   if (!session) {
      throw new Error("No open attendance session found.");
   }

   const { data: existingAttendance, error: existingAttendanceError } = await supabase
    .from("attendance_events")
    .select("id")
    .eq("attendance_session_id", session.id)
    .eq("student_profile_id", normalizedStudentProfileId)
    .maybeSingle();

   if (existingAttendanceError) {
     throw new Error("Failed to verify existing attendance record.");
   }

   if (existingAttendance?.id) {
     return { success: true, message: "Already marked present" };
   }

   const { error } = await supabase
    .from("attendance_events")
    .insert({
       attendance_session_id: session.id,
       student_profile_id: normalizedStudentProfileId,
       matched_by: "facial_recognition",
       confidence_score: boundedConfidence
    });

   if (error) {
     if (error.code === '23505') { 
        return { success: true, message: "Already marked present" };
     }
     throw new Error("Failed to mark attendance.");
   }

   return { success: true };
}
