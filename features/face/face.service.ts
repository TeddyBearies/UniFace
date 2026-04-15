"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ensureStudentEnrolledInCourseAction } from "@/features/courses/course.service";
import { getAttendanceTiming } from "@/features/attendance/attendance-read.service";

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

async function resolveEnrollmentCandidate(
  universityId: string,
  courseId?: string,
  options?: {
    allowCompletedFaceEnrollment?: boolean;
  },
) {
  const auth = await requireInstructorOrAdmin();
  const normalizedUniversityId = normalizeUniversityId(universityId);
  const normalizedCourseId = courseId?.trim() || "";

  if (!/^\d{8}$/.test(normalizedUniversityId)) {
    throw new Error("University ID must be exactly 8 digits.");
  }

  const supabase = createClient();
  if (auth.role !== "admin" && normalizedCourseId) {
    const { data: isInstructor } = await supabase.rpc("is_instructor_for_course", {
      course_id: normalizedCourseId,
    });

    if (!isInstructor) {
      throw new Error("Not an instructor for the selected course.");
    }
  }

  const admin = createAdminClient();

  const { data: profileData, error: profileErr } = await admin
    .from("profiles")
    .select("id, full_name, role, university_id, face_profiles(id, enrollment_status)")
    .eq("university_id", normalizedUniversityId)
    .maybeSingle();

  if (profileErr || !profileData) {
    throw new Error("No student found with that 8-digit University ID.");
  }

  if (profileData.role !== "student") {
    throw new Error("The provided university ID does not belong to a student account.");
  }

  if (!profileData.full_name?.trim()) {
    throw new Error("This student profile is missing a full name. Update the account before face enrollment.");
  }

  if (!profileData.university_id?.trim()) {
    throw new Error("This student profile is missing a university ID. Update the account before face enrollment.");
  }

  const faceProfile = Array.isArray(profileData.face_profiles)
    ? profileData.face_profiles[0]
    : profileData.face_profiles;

  if (!faceProfile?.id) {
    throw new Error("Face profile not found for this student.");
  }

  if (
    faceProfile.enrollment_status === "complete" &&
    !options?.allowCompletedFaceEnrollment
  ) {
    throw new Error("This student already has enrolled face data. Reset it before enrolling again.");
  }

  let isEnrolledInSelectedCourse = false;
  if (normalizedCourseId) {
    const { data: enrollment, error: enrollmentError } = await admin
      .from("course_enrollments")
      .select("id")
      .eq("course_id", normalizedCourseId)
      .eq("student_profile_id", profileData.id)
      .eq("status", "active")
      .maybeSingle();

    if (enrollmentError) {
      throw new Error("Failed to verify whether the student is on the selected course roster.");
    }

    isEnrolledInSelectedCourse = Boolean(enrollment?.id);
  }

  return {
    studentProfileId: profileData.id,
    fullName: profileData.full_name || "",
    universityId: profileData.university_id || normalizedUniversityId,
    faceProfileId: faceProfile.id,
    faceEnrollmentStatus: faceProfile.enrollment_status,
    isEnrolledInSelectedCourse,
  };
}

export async function getEnrollmentCandidateAction(universityId: string, courseId?: string) {
  const candidate = await resolveEnrollmentCandidate(universityId, courseId, {
    allowCompletedFaceEnrollment: true,
  });

  return {
    studentProfileId: candidate.studentProfileId,
    fullName: candidate.fullName,
    universityId: candidate.universityId,
    faceEnrollmentStatus: candidate.faceEnrollmentStatus,
    isEnrolledInSelectedCourse: candidate.isEnrolledInSelectedCourse,
  };
}

export async function enrollStudentFaceAction(
  universityId: string,
  descriptorArray: number[],
  courseId?: string,
) {
  const candidate = await resolveEnrollmentCandidate(universityId, courseId);

  validateDescriptorArray(descriptorArray);

  const admin = createAdminClient();

  const path = `${candidate.faceProfileId}/template.json`;
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
      face_profile_id: candidate.faceProfileId,
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
    .eq("id", candidate.faceProfileId);

  if (updateError) {
    throw new Error("Failed to update enrollment status.");
  }

  let isEnrolledInSelectedCourse = candidate.isEnrolledInSelectedCourse;
  if (courseId?.trim() && !isEnrolledInSelectedCourse) {
    await ensureStudentEnrolledInCourseAction(courseId, candidate.studentProfileId);
    isEnrolledInSelectedCourse = true;
  }

  return {
    success: true,
    isEnrolledInSelectedCourse,
  };
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

  if (!enrollments || enrollments.length === 0) {
    return {
      templates: [],
      activeEnrollmentCount: 0,
      faceReadyCount: 0,
    };
  }

  const studentIds = enrollments.map(e => e.student_profile_id);

  // We fetch profiles and full_name so we return full_name along with descriptor
  const { data: profiles } = await admin
    .from("profiles")
    .select(
      "id, full_name, university_id, face_profiles(id, enrollment_status, face_templates(storage_object_path))",
    )
    .in("id", studentIds);

  if (!profiles) {
    return {
      templates: [],
      activeEnrollmentCount: enrollments.length,
      faceReadyCount: 0,
    };
  }

  const templates = [];
  let faceReadyCount = 0;
  for (const prof of profiles) {
    const faceProf = Array.isArray(prof.face_profiles) ? prof.face_profiles[0] : prof.face_profiles;
    if (faceProf && faceProf.enrollment_status === 'complete') {
      faceReadyCount += 1;
      if (!prof.full_name?.trim() || !prof.university_id?.trim()) {
        continue;
      }
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
            universityId: prof.university_id,
            descriptorArray,
          });
        }
      }
    }
  }

  return {
    templates,
    activeEnrollmentCount: enrollments.length,
    faceReadyCount,
  };
}

export async function markAttendanceAction(
  attendanceSessionId: string,
  studentProfileId: string,
  confidenceScore: number,
) {
   const normalizedSessionId = attendanceSessionId.trim();
   const normalizedStudentProfileId = studentProfileId.trim();
   if (!normalizedSessionId || !normalizedStudentProfileId) {
     throw new Error("Attendance session and student are required.");
   }

   const auth = await requireInstructorOrAdmin();

   const boundedConfidence = Math.max(0, Math.min(1, confidenceScore));
   const supabase = createClient();

   const { data: session, error: sessionError } = await supabase
     .from("attendance_sessions")
     .select(
       `
         id,
         course_id,
         created_by_profile_id,
         status,
         starts_at,
         ends_at,
         courses (
           code,
           title
         )
       `,
     )
     .eq("id", normalizedSessionId)
     .maybeSingle();

   if (sessionError || !session) {
      throw new Error("Attendance session not found.");
   }

   if (session.status !== "open") {
      throw new Error("This attendance session is no longer open.");
   }

   if (auth.role !== "admin" && session.created_by_profile_id !== auth.userId) {
      throw new Error("You can only record attendance in sessions you started.");
   }

   const admin = createAdminClient();
   const { data: studentProfile, error: studentProfileError } = await admin
     .from("profiles")
     .select("id, full_name, university_id")
     .eq("id", normalizedStudentProfileId)
     .maybeSingle();

   if (studentProfileError || !studentProfile) {
     throw new Error("Matched student profile could not be verified.");
   }

   if (!studentProfile.full_name?.trim() || !studentProfile.university_id?.trim()) {
     throw new Error("Matched student profile is incomplete and cannot be used for attendance.");
   }

   const { data: activeEnrollment, error: enrollmentError } = await admin
     .from("course_enrollments")
     .select("id")
     .eq("course_id", session.course_id)
     .eq("student_profile_id", normalizedStudentProfileId)
     .eq("status", "active")
     .maybeSingle();

   if (enrollmentError) {
     throw new Error("Failed to verify the selected student's course enrollment.");
   }

   if (!activeEnrollment?.id) {
     throw new Error("This student is not actively enrolled in the current class session.");
   }

   const { data: existingAttendance, error: existingAttendanceError } = await supabase
    .from("attendance_events")
    .select("id")
    .eq("attendance_session_id", normalizedSessionId)
    .eq("student_profile_id", normalizedStudentProfileId)
    .maybeSingle();

   if (existingAttendanceError) {
     throw new Error("Failed to verify existing attendance record.");
   }

   if (existingAttendance?.id) {
     return { success: true, message: "Already marked present" };
   }

   const recordedAt = new Date().toISOString();
   const timing = getAttendanceTiming(session.starts_at, recordedAt);
   const course = Array.isArray(session.courses) ? session.courses[0] : session.courses;

   const { error } = await supabase
    .from("attendance_events")
    .insert({
       attendance_session_id: normalizedSessionId,
       student_profile_id: normalizedStudentProfileId,
       matched_by: "facial_recognition",
       confidence_score: boundedConfidence,
       recorded_at: recordedAt,
    });

   if (error) {
     if (error.code === '23505') { 
        return { success: true, message: "Already marked present" };
     }
     throw new Error("Failed to mark attendance.");
   }

   revalidatePath("/instructor/dashboard");
   revalidatePath("/instructor/class-attendance");
   revalidatePath("/instructor/reports");
   revalidatePath("/student/dashboard");
   revalidatePath("/student/attendance-history");
   revalidatePath("/admin/reports");

   return {
     success: true,
     studentProfileId: studentProfile.id,
     studentName: studentProfile.full_name,
     studentId: studentProfile.university_id,
     courseId: session.course_id,
     courseCode: course?.code || "---",
     courseTitle: course?.title || "Unknown Course",
     attendanceSessionId: normalizedSessionId,
     sessionStartsAt: session.starts_at,
     sessionEndsAt: session.ends_at || null,
     recordedAt,
     status: timing.status,
     lateMinutes: timing.lateMinutes,
     confidenceScore: boundedConfidence,
   };
}
