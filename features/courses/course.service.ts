"use server";

import { createClient } from "@/lib/supabase/server";

export async function getInstructorCoursesAction() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: assignments, error } = await supabase
    .from("course_instructors")
    .select(`
      course_id,
      courses ( title, code )
    `)
    .eq("instructor_profile_id", user.id);

  if (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error("Failed to load your assigned courses.");
  }

  // Format and safely map
  return (assignments || []).map(a => {
    // Supabase TS bindings usually make joined relations single objects or arrays based on FK uniqueness
    const courseInfo = Array.isArray(a.courses) ? a.courses[0] : a.courses;
    return {
      id: a.course_id,
      title: courseInfo?.title || "Unknown Course",
      code: courseInfo?.code || "???"
    };
  });
}
