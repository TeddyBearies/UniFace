"use client";

import InstructorPageFrame from "@/components/InstructorPageFrame";
import { useEffect, useState } from "react";
import { useFaceApi } from "@/features/face/useFaceApi";
import { useClientRoleGuard } from "@/features/auth/useClientRoleGuard";
import {
  enrollStudentFaceAction,
  getEnrollmentCandidateAction,
} from "@/features/face/face.service";
import {
  ensureStudentEnrolledInCourseAction,
  getInstructorCoursesAction,
} from "@/features/courses/course.service";

function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2aa0b2"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function DetailsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2aa0b2"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <path d="M4 7h8" />
      <path d="M4 12h6" />
      <path d="M4 17h5" />
      <path d="m15 15 2 2 4-5" />
      <circle cx="16" cy="8" r="2" />
    </svg>
  );
}

function FaceIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2aa0b2"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8.2 10.2h.01" />
      <path d="M15.8 10.2h.01" />
      <path d="M9 15c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5" />
      <path d="M7.5 8C8.6 6.4 10.1 5.6 12 5.6S15.4 6.4 16.5 8" />
    </svg>
  );
}

function CameraOffIcon({ color = "#9ba6ba", size = 78 }: { color?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flex: "none" }}
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6 17 17H6a2 2 0 0 1-2-2V8.2" />
      <path d="M9.5 4H16a2 2 0 0 1 2 2v2.5L21 6v12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7c8798"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function StartEnrollIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <path d="M4 11V7a2 2 0 0 1 2-2h4" />
      <path d="M20 13v4a2 2 0 0 1-2 2h-4" />
      <path d="M4 13v4a2 2 0 0 0 2 2h4" />
      <path d="M20 11V7a2 2 0 0 0-2-2h-4" />
      <path d="M9 12h6" />
      <path d="m12 9 3 3-3 3" />
    </svg>
  );
}

function CaptureIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 22, height: 22, flex: "none" }}
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M4.5 12A7.5 7.5 0 0 1 12 4.5" />
      <path d="M19.5 12A7.5 7.5 0 0 1 12 19.5" />
      <path d="M12 4.5A7.5 7.5 0 0 1 19.5 12" />
      <path d="M12 19.5A7.5 7.5 0 0 1 4.5 12" />
    </svg>
  );
}

function StepSquare({ number }: { number: string }) {
  return (
    <span className="stepSquare" aria-hidden="true">
      {number}
    </span>
  );
}

export default function InstructorEnrollStudentPage() {
  const {
    isModelLoaded,
    isLoading: isFaceApiLoading,
    error: faceApiError,
    videoRef,
    loadWebcam,
    stopWebcam,
    detectSingleFace,
  } = useFaceApi();
  const { isChecking: isRoleChecking, isAuthorized } = useClientRoleGuard([
    "instructor",
    "admin",
  ]);

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [availableCourses, setAvailableCourses] = useState<
    { id: string; title: string; code: string }[]
  >([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [courseLoadError, setCourseLoadError] = useState("");

  const [cameraActive, setCameraActive] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState<"idle" | "capturing" | "captured" | "saving" | "success" | "error">("idle");
  const [enrollMessage, setEnrollMessage] = useState("");
  const [descriptor, setDescriptor] = useState<Float32Array | null>(null);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      setIsLoadingCourses(true);
      setCourseLoadError("");

      try {
        const courses = await getInstructorCoursesAction();
        if (!mounted) {
          return;
        }

        setAvailableCourses(courses);
      } catch (error: any) {
        if (!mounted) {
          return;
        }

        setAvailableCourses([]);
        setCourseLoadError(error?.message || "Failed to load assigned courses.");
      } finally {
        if (mounted) {
          setIsLoadingCourses(false);
        }
      }
    }

    if (!isRoleChecking) {
      loadCourses();
    }

    return () => {
      mounted = false;
    };
  }, [isRoleChecking]);

  const handleStartScan = async () => {
    if (!isAuthorized) {
      setEnrollMessage("Your session is not authorized for enrollment.");
      setEnrollStatus("error");
      return;
    }

    const normalizedStudentId = studentId.trim();
    const normalizedStudentName = studentName.trim();

    if (!normalizedStudentId || !normalizedStudentName || !/^\d{8}$/.test(normalizedStudentId)) {
      setEnrollMessage("Please enter an 8-digit student ID and name first.");
      setEnrollStatus("error");
      return;
    }

    if (isFaceApiLoading) {
      setEnrollMessage("AI models are still loading. Please wait a moment and try again.");
      setEnrollStatus("error");
      return;
    }

    if (!isModelLoaded) {
      setEnrollMessage("Face recognition models are not ready yet. Please try again.");
      setEnrollStatus("error");
      return;
    }

    setEnrollStatus("idle");
    setEnrollMessage("");
    setDescriptor(null);
    try {
      const studentRecord = await getEnrollmentCandidateAction(normalizedStudentId, course);

      if (
        normalizedStudentName &&
        studentRecord.fullName &&
        normalizedStudentName.toLowerCase() !== studentRecord.fullName.toLowerCase()
      ) {
        setEnrollMessage(
          `Student ID ${normalizedStudentId} belongs to ${studentRecord.fullName}. Please correct the name before scanning.`,
        );
        setEnrollStatus("error");
        return;
      }

      if (studentRecord.faceEnrollmentStatus === "complete") {
        if (course && !studentRecord.isEnrolledInSelectedCourse) {
          await ensureStudentEnrolledInCourseAction(course, studentRecord.studentProfileId);
          setEnrollStatus("idle");
          setEnrollMessage(
            "This student already had face data and has now been added to the selected course roster.",
          );
          setStudentId("");
          setStudentName("");
          setDescriptor(null);
          setCameraActive(false);
          return;
        }

        setEnrollStatus("error");
        setEnrollMessage(
          "This student already has enrolled face data. Reset it before enrolling again.",
        );
        setCameraActive(false);
        return;
      }

      setStudentName(studentRecord.fullName || normalizedStudentName);
      if (course && !studentRecord.isEnrolledInSelectedCourse) {
        setEnrollMessage(
          "This student is not yet on the selected course roster. Saving face enrollment will add them to that course automatically.",
        );
      }
      await loadWebcam();
      setCameraActive(true);
    } catch (error: any) {
      setCameraActive(false);
      setEnrollStatus("error");
      setEnrollMessage(error?.message || "Failed to access webcam.");
    }
  };

  const handleCapture = async () => {
    if (!cameraActive) {
      setEnrollStatus("error");
      setEnrollMessage("Start enrollment scan before capturing.");
      return;
    }

    setEnrollStatus("capturing");
    setEnrollMessage("Scanning face...");
    try {
      const { descriptor } = await detectSingleFace();
      setDescriptor(descriptor);
      setEnrollStatus("captured");
      setEnrollMessage("Face captured successfully! Ready to save.");
      stopWebcam();
      setCameraActive(false);
    } catch (err: any) {
      setEnrollStatus("error");
      setEnrollMessage(err.message || "Failed to capture face.");
    }
  };

  const handleSave = async () => {
    if (!descriptor) return;

    const normalizedStudentId = studentId.trim();
    if (!/^\d{8}$/.test(normalizedStudentId)) {
      setEnrollStatus("error");
      setEnrollMessage("Student ID must be exactly 8 digits.");
      return;
    }

    setEnrollStatus("saving");
    setEnrollMessage("Saving biometric data...");
    try {
      const result = await enrollStudentFaceAction(
        normalizedStudentId,
        Array.from(descriptor),
        course,
      );
      setEnrollStatus("success");
      setEnrollMessage(
        course
          ? "Student face enrolled securely and added to the selected course roster."
          : "Student face enrolled securely.",
      );
      setDescriptor(null);
      setStudentId("");
      setStudentName("");
      setCourse("");
      stopWebcam();
      setCameraActive(false);
    } catch (err: any) {
      setEnrollStatus("error");
      setEnrollMessage(err.message || "Failed to save face template.");
    }
  };

  return (
    <InstructorPageFrame activeNav="enroll-student">
      <div className="enroll-student-page instructor-page-content">
        <header className="pageHeader">
          <h1>Enroll New Student</h1>
          <div className="infoPill">
            <InfoIcon />
            <span>FIRST TIME REGISTRATION ONLY</span>
          </div>
        </header>

        <div className="enrollGrid">
          <section className="panelCard studentDetailsCard">
            <div className="panelTitle">
              <DetailsIcon />
              <h2>Student Details</h2>
            </div>
            
            {faceApiError && <p style={{ color: "var(--danger-red)", marginBottom: "1rem", fontSize: "0.875rem" }}>{faceApiError}</p>}
            {isFaceApiLoading && <p style={{ color: "var(--accent-teal)", marginBottom: "1rem", fontSize: "0.875rem" }}>Loading AI Models...</p>}

            <div className="formGroup">
              <label htmlFor="student-id">Student ID</label>
              <input
                id="student-id"
                name="studentId"
                type="text"
                placeholder="Enter 8-digit ID"
                value={studentId}
                onChange={(event) => {
                  setStudentId(event.target.value);
                  setDescriptor(null);
                }}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="student-name">Student Name</label>
              <input id="student-name" name="studentName" type="text" placeholder="Enter full name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            </div>

            <div className="formGroup">
              <label htmlFor="student-course">Course / Group (Optional)</label>
              <div className="selectField">
                <select id="student-course" name="course" value={course} onChange={(e) => setCourse(e.target.value)}>
                  <option value="">
                    {isLoadingCourses ? "Loading assigned courses..." : "Select course"}
                  </option>
                  {availableCourses.map((courseOption) => (
                    <option key={courseOption.id} value={courseOption.id}>
                      {courseOption.code} - {courseOption.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            {courseLoadError && (
              <p style={{ color: "var(--danger-red)", marginTop: "-0.25rem", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                {courseLoadError}
              </p>
            )}

            <button
              type="button"
              className="primaryAction largeAction"
              onClick={handleStartScan}
              disabled={
                cameraActive || isRoleChecking || !isAuthorized
              }
            >
              <StartEnrollIcon />
              <span>Start Enrollment Scan</span>
            </button>

            {enrollMessage && (
              <p
                data-testid="enrollment-message"
                role={enrollStatus === "error" ? "alert" : "status"}
                aria-live={enrollStatus === "error" ? "assertive" : "polite"}
                style={{
                  color:
                    enrollStatus === "error"
                      ? "var(--danger-red)"
                      : "var(--accent-teal)",
                  marginTop: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {enrollMessage}
              </p>
            )}
          </section>

          <section className="panelCard biometricCard">
            <div className="panelTitle">
              <FaceIcon />
              <h2>Biometric Registration</h2>
            </div>

            <div className="enrollCameraFrame" style={{ position: "relative", overflow: "hidden" }}>
              <span className="frameCorner topLeft" />
              <span className="frameCorner topRight" />
              <span className="frameCorner bottomLeft" />
              <span className="frameCorner bottomRight" />

              {!cameraActive && enrollStatus !== "captured" && (
                <div className="cameraInnerContent">
                  <CameraOffIcon />
                  <h3>Camera Feed Placeholder</h3>
                  <p>Ready for face capture</p>
                </div>
              )}
              
              {enrollStatus === "captured" && !cameraActive && (
                 <div className="cameraInnerContent">
                   <FaceIcon />
                   <h3 style={{ marginTop: "1rem" }}>Face Captured Successfully</h3>
                   <p>Proceed to save data</p>
                 </div>
              )}

              <video 
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: cameraActive ? "block" : "none",
                  transform: "scaleX(-1)"
                }}
                muted
                playsInline
              />
            </div>
            
            {enrollStatus === "captured" || enrollStatus === "saving" || enrollStatus === "success" ? (
              <button
                type="button"
                className="primaryAction largeAction"
                onClick={handleSave}
                disabled={
                  enrollStatus === "saving" || enrollStatus === "success" || isRoleChecking || !isAuthorized
                }
              >
                <CaptureIcon />
                <span>{enrollStatus === 'saving' ? 'Saving...' : enrollStatus === 'success' ? 'Saved' : 'Save Face Data'}</span>
              </button>
            ) : (
              <button
                type="button"
                className="primaryAction largeAction"
                onClick={handleCapture}
                disabled={
                  !cameraActive || enrollStatus === "capturing" || isRoleChecking || !isAuthorized
                }
              >
                 <CaptureIcon />
                 <span>{enrollStatus === 'capturing' ? 'Processing...' : 'Capture Face and Save'}</span>
              </button>
            )}

            <p className="helperText">
              Ensure the student is in a well-lit area and looking directly at the
              <br />
              camera.
            </p>
          </section>
        </div>

        <section className="stepsGrid" aria-label="Enrollment steps">
           <article className="stepCard">
             <div className="stepHeader">
               <StepSquare number="1" />
               <h3>STEP 1</h3>
             </div>
             <p>Enter correct institutional student<br />identification details.</p>
           </article>
           <article className="stepCard">
             <div className="stepHeader">
               <StepSquare number="2" />
               <h3>STEP 2</h3>
             </div>
             <p>Position student within the camera<br />frame for optimal capture.</p>
           </article>
           <article className="stepCard">
             <div className="stepHeader">
               <StepSquare number="3" />
               <h3>STEP 3</h3>
             </div>
             <p>Capture face and save to encrypted<br />biometric database.</p>
           </article>
        </section>
      </div>
    </InstructorPageFrame>
  );
}
