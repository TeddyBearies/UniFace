"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentProfile } from "@/features/auth/guards";
import { createClient } from "@/lib/supabase/server";

const ADMIN_COURSE_ASSIGNMENT_PATH = "/admin/course-assignment";

type AssignmentSearchFilters = {
  q?: string;
  semester?: string;
};

export type AdminInstructorOption = {
  id: string;
  name: string;
  email: string;
};

export type AdminCourseOption = {
  id: string;
  code: string;
  title: string;
  semester: string;
  instructorCount: number;
};

export type AdminCourseAssignmentRow = {
  id: string;
  courseId: string;
  instructorName: string;
  instructorEmail: string;
  courseTitle: string;
  courseCode: string;
  semester: string;
};

export type AdminCourseAssignmentData = {
  profileLabel: string;
  instructors: AdminInstructorOption[];
  courses: AdminCourseOption[];
  semesters: string[];
  selectedSemester: string;
  search: string;
  assignments: AdminCourseAssignmentRow[];
};

function sanitizeSearch(searchValue: string | undefined) {
  if (!searchValue) {
    return "";
  }

  return searchValue.replace(/[^a-zA-Z0-9@._\-\s]/g, " ").trim().slice(0, 64);
}

function normalizeSemester(semesterValue: string | undefined) {
  return String(semesterValue || "").trim();
}

function normalizeCourseCode(codeValue: string) {
  return codeValue
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, 24);
}

function normalizeCourseTitle(titleValue: string) {
  return titleValue.replace(/\s+/g, " ").trim().slice(0, 120);
}

function buildCourseAssignmentUrl(params: {
  q?: string;
  semester?: string;
  success?: string;
  error?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.semester) {
    searchParams.set("semester", params.semester);
  }

  if (params.success) {
    searchParams.set("success", params.success);
  }

  if (params.error) {
    searchParams.set("error", params.error);
  }

  const queryString = searchParams.toString();
  return queryString
    ? `${ADMIN_COURSE_ASSIGNMENT_PATH}?${queryString}`
    : ADMIN_COURSE_ASSIGNMENT_PATH;
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

type CourseAssignmentActionContext = {
  search: string;
  selectedSemester: string;
};

function getActionContext(formData: FormData): CourseAssignmentActionContext {
  const search = sanitizeSearch(normalizeText(formData.get("q")));
  const selectedSemester = normalizeSemester(
    normalizeText(formData.get("selectedSemester")),
  );

  return {
    search,
    selectedSemester,
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function checkCourseAssignmentExists(params: {
  supabase: ReturnType<typeof createClient>;
  courseId: string;
  instructorProfileId: string;
}) {
  const { data, error } = await params.supabase
    .from("course_instructors")
    .select("id")
    .eq("course_id", params.courseId)
    .eq("instructor_profile_id", params.instructorProfileId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data?.id);
}

export async function getAdminCourseAssignmentData(
  filters: AssignmentSearchFilters = {},
): Promise<AdminCourseAssignmentData> {
  const currentProfile = await requireCurrentProfile(["admin"]);
  const supabase = createClient();
  const selectedSemester = normalizeSemester(filters.semester);
  const search = sanitizeSearch(filters.q);

  const { data: instructors, error: instructorsError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "instructor")
    .order("full_name", { ascending: true });

  if (instructorsError) {
    throw instructorsError;
  }

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, code, title, semester")
    .order("semester", { ascending: false })
    .order("code", { ascending: true });

  if (coursesError) {
    throw coursesError;
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("course_instructors")
    .select(
      `
        id,
        instructor_profile_id,
        course_id,
        profiles ( full_name, email ),
        courses ( title, code, semester )
      `,
    )
    .order("created_at", { ascending: false });

  if (assignmentsError) {
    throw assignmentsError;
  }

  const allNormalizedAssignments: AdminCourseAssignmentRow[] = (assignments || [])
    .map((assignment) => {
      const instructor = Array.isArray(assignment.profiles)
        ? assignment.profiles[0]
        : assignment.profiles;
      const course = Array.isArray(assignment.courses)
        ? assignment.courses[0]
        : assignment.courses;

      if (!assignment.id || !assignment.course_id || !instructor || !course) {
        return null;
      }

      return {
        id: assignment.id,
        courseId: assignment.course_id,
        instructorName: instructor.full_name || "Unknown Instructor",
        instructorEmail: instructor.email || "No email",
        courseTitle: course.title || "Unknown Course",
        courseCode: course.code || "---",
        semester: course.semester || "Unknown",
      };
    })
    .filter(Boolean) as AdminCourseAssignmentRow[];

  let normalizedAssignments = allNormalizedAssignments;

  if (selectedSemester) {
    normalizedAssignments = normalizedAssignments.filter(
      (assignment) => assignment.semester === selectedSemester,
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    normalizedAssignments = normalizedAssignments.filter((assignment) => {
      return (
        assignment.instructorName.toLowerCase().includes(searchLower) ||
        assignment.instructorEmail.toLowerCase().includes(searchLower) ||
        assignment.courseTitle.toLowerCase().includes(searchLower) ||
        assignment.courseCode.toLowerCase().includes(searchLower) ||
        assignment.semester.toLowerCase().includes(searchLower)
      );
    });
  }

  const courseInstructorCounts = new Map<string, number>();
  for (const assignment of allNormalizedAssignments) {
    const currentCount = courseInstructorCounts.get(assignment.courseId) || 0;
    courseInstructorCounts.set(assignment.courseId, currentCount + 1);
  }

  const semesters = Array.from(new Set((courses || []).map((course) => course.semester)))
    .filter(Boolean)
    .sort((left, right) => right.localeCompare(left));

  if (selectedSemester && !semesters.includes(selectedSemester)) {
    semesters.unshift(selectedSemester);
  }

  return {
    profileLabel:
      currentProfile.profile.full_name || currentProfile.user.email || "Admin",
    instructors: (instructors || []).map((instructor) => ({
      id: instructor.id,
      name: instructor.full_name || instructor.email || "Unknown Instructor",
      email: instructor.email || "No email",
    })),
    courses: (courses || []).map((course) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      semester: course.semester,
      instructorCount: courseInstructorCounts.get(course.id) || 0,
    })),
    semesters,
    selectedSemester,
    search,
    assignments: normalizedAssignments,
  };
}

export async function assignInstructorToCourseAction(formData: FormData) {
  await requireCurrentProfile(["admin"]);
  const supabase = createClient();

  const instructorProfileId = normalizeText(formData.get("instructorProfileId"));
  const courseId = normalizeText(formData.get("courseId"));
  const semester = normalizeText(formData.get("semester"));
  const { search, selectedSemester } = getActionContext(formData);
  const resolvedSemester = selectedSemester || semester;

  if (!isUuid(instructorProfileId) || !isUuid(courseId)) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: resolvedSemester,
        error: "Choose both instructor and course.",
      }),
    );
  }

  if (!semester) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: resolvedSemester,
        error: "Select a semester.",
      }),
    );
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("semester")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: resolvedSemester,
        error: "Selected course was not found.",
      }),
    );
  }

  if (course.semester !== semester) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: resolvedSemester,
        error: "Selected semester does not match the selected course.",
      }),
    );
  }

  const alreadyAssigned = await checkCourseAssignmentExists({
    supabase,
    courseId,
    instructorProfileId,
  });

  if (alreadyAssigned) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: resolvedSemester,
        error: "That instructor is already assigned to this course.",
      }),
    );
  }

  const { error } = await supabase.from("course_instructors").insert({
    instructor_profile_id: instructorProfileId,
    course_id: courseId,
  });

  if (error) {
    if (error.code === "23505") {
      redirect(
        buildCourseAssignmentUrl({
          q: search,
          semester: resolvedSemester,
          error: "That instructor is already assigned to this course.",
        }),
      );
    }

    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: resolvedSemester,
        error: "Failed to save assignment.",
      }),
    );
  }

  revalidatePath(ADMIN_COURSE_ASSIGNMENT_PATH);
  redirect(
    buildCourseAssignmentUrl({
      q: search,
      semester: resolvedSemester,
      success: "Course assignment created successfully.",
    }),
  );
}

export async function createCourseAndAssignInstructorAction(formData: FormData) {
  await requireCurrentProfile(["admin"]);
  const supabase = createClient();

  const courseCode = normalizeCourseCode(normalizeText(formData.get("courseCode")));
  const courseTitle = normalizeCourseTitle(normalizeText(formData.get("courseTitle")));
  const semester = normalizeSemester(normalizeText(formData.get("semester")));
  const instructorProfileId = normalizeText(formData.get("instructorProfileId"));
  const { search } = getActionContext(formData);

  if (!courseCode || !courseTitle || !semester) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester,
        error: "Course code, title, and semester are required.",
      }),
    );
  }

  if (instructorProfileId && !isUuid(instructorProfileId)) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester,
        error: "Choose a valid instructor or leave it empty.",
      }),
    );
  }

  if (instructorProfileId) {
    const { data: instructor, error: instructorLookupError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", instructorProfileId)
      .eq("role", "instructor")
      .maybeSingle();

    if (instructorLookupError || !instructor) {
      redirect(
        buildCourseAssignmentUrl({
          q: search,
          semester,
          error: "Selected instructor was not found.",
        }),
      );
    }
  }

  const { data: existingCourse, error: existingCourseError } = await supabase
    .from("courses")
    .select("id")
    .eq("code", courseCode)
    .eq("semester", semester)
    .maybeSingle();

  if (existingCourseError) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester,
        error: "Failed to verify existing courses.",
      }),
    );
  }

  if (existingCourse?.id) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester,
        error: "A course with this code already exists in the selected semester.",
      }),
    );
  }

  const { data: course, error: courseInsertError } = await supabase
    .from("courses")
    .insert({
      code: courseCode,
      title: courseTitle,
      semester,
    })
    .select("id")
    .maybeSingle();

  if (courseInsertError || !course?.id) {
    if (courseInsertError?.code === "23505") {
      redirect(
        buildCourseAssignmentUrl({
          q: search,
          semester,
          error: "A course with this code already exists in the selected semester.",
        }),
      );
    }

    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester,
        error: "Failed to create course.",
      }),
    );
  }

  if (instructorProfileId) {
    const { error: assignmentInsertError } = await supabase.from("course_instructors").insert({
      course_id: course.id,
      instructor_profile_id: instructorProfileId,
    });

    if (assignmentInsertError) {
      await supabase.from("courses").delete().eq("id", course.id);
      redirect(
        buildCourseAssignmentUrl({
          q: search,
          semester,
          error: "Course was not saved because assigning the instructor failed.",
        }),
      );
    }
  }

  revalidatePath(ADMIN_COURSE_ASSIGNMENT_PATH);
  redirect(
    buildCourseAssignmentUrl({
      q: search,
      semester,
      success: instructorProfileId
        ? "Course created and instructor assigned successfully."
        : "Course created successfully.",
    }),
  );
}

export async function removeCourseAssignmentAction(formData: FormData) {
  await requireCurrentProfile(["admin"]);
  const supabase = createClient();

  const assignmentId = normalizeText(formData.get("assignmentId"));
  const { search, selectedSemester } = getActionContext(formData);

  if (!isUuid(assignmentId)) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: selectedSemester,
        error: "Invalid assignment request.",
      }),
    );
  }

  const { error } = await supabase.from("course_instructors").delete().eq("id", assignmentId);
  if (error) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: selectedSemester,
        error: "Failed to remove assignment.",
      }),
    );
  }

  revalidatePath(ADMIN_COURSE_ASSIGNMENT_PATH);
  redirect(
    buildCourseAssignmentUrl({
      q: search,
      semester: selectedSemester,
      success: "Assignment removed successfully.",
    }),
  );
}

export async function deleteCourseAction(formData: FormData) {
  await requireCurrentProfile(["admin"]);
  const supabase = createClient();

  const courseId = normalizeText(formData.get("courseId"));
  const { search, selectedSemester } = getActionContext(formData);

  if (!isUuid(courseId)) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: selectedSemester,
        error: "Invalid course delete request.",
      }),
    );
  }

  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) {
    redirect(
      buildCourseAssignmentUrl({
        q: search,
        semester: selectedSemester,
        error: "Failed to delete course.",
      }),
    );
  }

  revalidatePath(ADMIN_COURSE_ASSIGNMENT_PATH);
  redirect(
    buildCourseAssignmentUrl({
      q: search,
      semester: selectedSemester,
      success: "Course deleted successfully.",
    }),
  );
}
