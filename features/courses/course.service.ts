"use server";

import { getInstructorCourseOptions } from "@/features/attendance/instructor-records.service";

export async function getInstructorCoursesAction() {
  try {
    return await getInstructorCourseOptions();
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error("Failed to load your assigned courses.");
  }
}
