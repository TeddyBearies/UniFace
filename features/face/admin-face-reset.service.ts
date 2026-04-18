"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentProfile } from "@/features/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ADMIN_FACE_RESET_PATH = "/admin/reset-face-data";

export type AdminFaceResetLookup = {
  profileId: string;
  fullName: string;
  email: string;
  universityId: string | null;
  enrollmentStatus: string;
  templatePath: string | null;
  lastEnrolledAt: string | null;
} | null;

export type AdminFaceResetData = {
  profileLabel: string;
  lookupQuery: string;
  lookupResult: AdminFaceResetLookup;
};

function normalizeText(value: string | FormDataEntryValue | null | undefined) {
  return String(value || "").trim();
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function buildFaceResetUrl(params: {
  query?: string;
  success?: string;
  error?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set("query", params.query);
  }

  if (params.success) {
    searchParams.set("success", params.success);
  }

  if (params.error) {
    searchParams.set("error", params.error);
  }

  const queryString = searchParams.toString();
  return queryString ? `${ADMIN_FACE_RESET_PATH}?${queryString}` : ADMIN_FACE_RESET_PATH;
}

async function findProfileByLookup(lookupQuery: string) {
  const supabase = createClient();

  // Admins can come in with different identifiers depending on the situation:
  // a pasted UUID from Supabase, an email from support, or the university ID
  // used by instructors in the enrollment flow.
  if (isUuid(lookupQuery)) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, university_id")
      .eq("id", lookupQuery)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  if (lookupQuery.includes("@")) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, university_id")
      .eq("email", lookupQuery.toLowerCase())
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, university_id")
    .eq("university_id", lookupQuery)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getAdminFaceResetData(query?: string): Promise<AdminFaceResetData> {
  const currentProfile = await requireCurrentProfile(["admin"]);
  const lookupQuery = normalizeText(query);

  if (!lookupQuery) {
    return {
      profileLabel:
        currentProfile.profile.full_name || currentProfile.user.email || "Admin",
      lookupQuery: "",
      lookupResult: null,
    };
  }

  const matchedProfile = await findProfileByLookup(lookupQuery);
  if (!matchedProfile) {
    return {
      profileLabel:
        currentProfile.profile.full_name || currentProfile.user.email || "Admin",
      lookupQuery,
      lookupResult: null,
    };
  }

  const supabase = createClient();
  const { data: faceProfile, error: faceProfileError } = await supabase
    .from("face_profiles")
    .select("id, enrollment_status, last_enrolled_at, face_templates(storage_object_path)")
    .eq("profile_id", matchedProfile.id)
    .maybeSingle();

  if (faceProfileError) {
    throw faceProfileError;
  }

  const faceTemplate = Array.isArray(faceProfile?.face_templates)
    ? faceProfile?.face_templates[0]
    : faceProfile?.face_templates;

  return {
    profileLabel:
      currentProfile.profile.full_name || currentProfile.user.email || "Admin",
    lookupQuery,
    lookupResult: {
      profileId: matchedProfile.id,
      fullName: matchedProfile.full_name || "Unknown Student",
      email: matchedProfile.email || "No email",
      universityId: matchedProfile.university_id || null,
      enrollmentStatus: faceProfile?.enrollment_status || "not_started",
      templatePath: faceTemplate?.storage_object_path || null,
      lastEnrolledAt: faceProfile?.last_enrolled_at || null,
    },
  };
}

export async function resetFaceDataAction(formData: FormData) {
  await requireCurrentProfile(["admin"]);

  const profileId = normalizeText(formData.get("profileId"));
  const query = normalizeText(formData.get("query"));

  if (!isUuid(profileId)) {
    redirect(
      buildFaceResetUrl({
        query,
        error: "Invalid reset request.",
      }),
    );
  }

  const admin = createAdminClient();

  const { data: faceProfile, error: faceProfileError } = await admin
    .from("face_profiles")
    .select("id, face_templates(id, storage_object_path)")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (faceProfileError || !faceProfile?.id) {
    redirect(
      buildFaceResetUrl({
        query,
        error: "No face profile found for that user.",
      }),
    );
  }

  const faceTemplate = Array.isArray(faceProfile.face_templates)
    ? faceProfile.face_templates[0]
    : faceProfile.face_templates;

  // Resetting biometric data has two separate cleanup steps: remove the private
  // stored template file, then remove the relational pointer that references it.
  if (faceTemplate?.storage_object_path) {
    const { error: storageDeleteError } = await admin.storage
      .from("face-templates")
      .remove([faceTemplate.storage_object_path]);

    if (storageDeleteError) {
      redirect(
        buildFaceResetUrl({
          query,
          error: "Failed to remove stored face template.",
        }),
      );
    }
  }

  const { error: deleteTemplateRowError } = await admin
    .from("face_templates")
    .delete()
    .eq("face_profile_id", faceProfile.id);

  if (deleteTemplateRowError) {
    redirect(
      buildFaceResetUrl({
        query,
        error: "Failed to remove face template record.",
      }),
    );
  }

  const { error: resetError } = await admin
    .from("face_profiles")
    .update({
      enrollment_status: "reset_required",
      last_enrolled_at: null,
    })
    .eq("id", faceProfile.id);

  if (resetError) {
    redirect(
      buildFaceResetUrl({
        query,
        error: "Failed to reset biometric data.",
      }),
    );
  }

  revalidatePath(ADMIN_FACE_RESET_PATH);
  redirect(
    buildFaceResetUrl({
      query,
      success: "Face data reset successfully.",
    }),
  );
}
