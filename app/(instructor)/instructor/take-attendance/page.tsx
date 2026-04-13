"use client";

import InstructorPageFrame from "@/components/InstructorPageFrame";
import { useState, useRef, useEffect, useCallback } from "react";
import { useFaceApi } from "@/features/face/useFaceApi";
import { useClientRoleGuard } from "@/features/auth/useClientRoleGuard";
import { getCourseFaceTemplatesAction, markAttendanceAction } from "@/features/face/face.service";
import { getInstructorCoursesAction } from "@/features/courses/course.service";
import { startAttendanceSessionAction, closeAttendanceSessionAction } from "@/features/attendance/attendance.service";
import * as faceapi from "face-api.js";

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 6 4-6 4z" fill="#ffffff" stroke="none" />
    </svg>
  );
}

function RotateIcon({ color = "#cbd5e1" }: { color?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <path d="M20 4v6h-6" />
      <path d="M4 20v-6h6" />
      <path d="M19 10a8 8 0 0 0-14-3l-1 1" />
      <path d="M5 14a8 8 0 0 0 14 3l1-1" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e48a8a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <circle cx="12" cy="12" r="10" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="#e48a8a" stroke="none" />
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

function CameraOffIcon({ color = "#707070", size = 84 }: { color?: string; size?: number }) {
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

function ScanAwaitIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c6cee0"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 34, height: 34, flex: "none" }}
    >
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4.5 18c1.3-3 3.2-4.6 5.5-4.6 1.1 0 2.1.3 3 .8" />
      <circle cx="16.8" cy="16.8" r="3.7" />
      <path d="m19.4 19.4 2.5 2.5" />
    </svg>
  );
}

export default function InstructorTakeAttendancePage() {
  const {
    isModelLoaded,
    videoRef,
    loadWebcam,
    stopWebcam,
    detectFaces,
    isLoading: isFaceApiLoading,
  } = useFaceApi();
  const { isChecking: isRoleChecking, isAuthorized } = useClientRoleGuard([
    "instructor",
    "admin",
  ]);

  const [courseId, setCourseId] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [templates, setTemplates] = useState<
    Array<{ studentProfileId: string; fullName: string; descriptorArray: number[] }>
  >([]);
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [lastScanName, setLastScanName] = useState("None");
  const [statusMessage, setStatusMessage] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const [instructorCourses, setInstructorCourses] = useState<
    { id: string; title: string; code: string }[]
  >([]);

  const loopRef = useRef<number | null>(null);
  const loopTimeoutRef = useRef<number | null>(null);
  const templatesRef = useRef(templates);
  const presentIdsRef = useRef(presentIds);
  const markingIdsRef = useRef<Set<string>>(new Set());
  const sessionActiveRef = useRef(sessionActive);
  const courseIdRef = useRef(courseId);

  useEffect(() => {
    templatesRef.current = templates;
  }, [templates]);

  useEffect(() => {
    presentIdsRef.current = presentIds;
  }, [presentIds]);

  useEffect(() => {
    sessionActiveRef.current = sessionActive;
  }, [sessionActive]);

  useEffect(() => {
    courseIdRef.current = courseId;
  }, [courseId]);

  // Load instructor's assigned courses on mount
  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      try {
        const courses = await getInstructorCoursesAction();
        if (mounted) {
          setInstructorCourses(courses);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setStatusMessage("Failed to load assigned courses.");
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

  const stopRecognitionLoop = useCallback(() => {
    if (loopRef.current !== null) {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
    }

    if (loopTimeoutRef.current !== null) {
      window.clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  }, []);

  // Recognition loop
  const runRecognition = useCallback(async () => {
    if (!sessionActiveRef.current) {
      return;
    }

    try {
      const detections = await detectFaces();
      if (!detections || detections.length === 0) {
        return;
      }

      for (const detection of detections) {
        let bestMatch: (typeof templatesRef.current)[number] | null = null;
        let minDistance = 0.45;

        for (const template of templatesRef.current) {
          const distance = faceapi.euclideanDistance(
            detection.descriptor,
            new Float32Array(template.descriptorArray),
          );
          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = template;
          }
        }

        if (!bestMatch) {
          continue;
        }

        const matchedStudentId = bestMatch.studentProfileId;
        if (
          presentIdsRef.current.has(matchedStudentId) ||
          markingIdsRef.current.has(matchedStudentId)
        ) {
          continue;
        }

        markingIdsRef.current.add(matchedStudentId);

        try {
          await markAttendanceAction(
            courseIdRef.current,
            matchedStudentId,
            Math.max(0, 1 - minDistance),
          );
          presentIdsRef.current = new Set(presentIdsRef.current).add(matchedStudentId);
          setPresentIds(new Set(presentIdsRef.current));
          setLastScanName(bestMatch.fullName);
        } catch (error: any) {
          console.error("Failed to mark attendance:", error);
          setStatusMessage(error?.message || "Failed to mark attendance for a detected face.");
        } finally {
          markingIdsRef.current.delete(matchedStudentId);
        }
      }
    } catch (error) {
      console.error("Recognition error:", error);
    } finally {
      if (sessionActiveRef.current) {
        loopTimeoutRef.current = window.setTimeout(() => {
          loopRef.current = requestAnimationFrame(runRecognition);
        }, 200);
      }
    }
  }, [detectFaces]);

  useEffect(() => {
    if (sessionActive) {
      loopRef.current = requestAnimationFrame(runRecognition);
    } else {
      stopRecognitionLoop();
    }

    return () => {
      stopRecognitionLoop();
    };
  }, [runRecognition, sessionActive, stopRecognitionLoop]);

  useEffect(() => {
    return () => {
      stopRecognitionLoop();
      stopWebcam();
    };
  }, [stopRecognitionLoop, stopWebcam]);

  const handleStartSession = async () => {
    if (!isAuthorized) {
      setStatusMessage("Your session is not authorized for attendance scanning.");
      return;
    }

    if (!courseId) {
      setStatusMessage("Please select a course first.");
      return;
    }

    setIsStarting(true);
    presentIdsRef.current = new Set();
    setPresentIds(new Set());
    setLastScanName("None");
    setStatusMessage("Fetching face templates for course...");
    let openedNewSession = false;

    try {
      // 1. Fetch the embedded descriptors securely
      const fetchedTemplates = await getCourseFaceTemplatesAction(courseId);
      if (fetchedTemplates.length === 0) {
        setStatusMessage("No enrolled student faces found for this course.");
        templatesRef.current = [];
        setTemplates([]);
        return;
      }
      templatesRef.current = fetchedTemplates;
      setTemplates(fetchedTemplates);

      // 2. Securely create or fetch to an open attendance session in DB
      setStatusMessage("Initiating attendance session...");
      const sessionResult = await startAttendanceSessionAction(courseId);
      openedNewSession = sessionResult.isNew;

      // 3. Start scanning module
      setStatusMessage("Starting camera...");
      await loadWebcam();
      setSessionActive(true);
      setStatusMessage("Session running. Scanning...");
    } catch (err: any) {
      stopWebcam();
      setSessionActive(false);

      if (openedNewSession) {
        try {
          await closeAttendanceSessionAction(courseId);
        } catch (closeError) {
          console.error("Failed to rollback session start:", closeError);
        }
      }

      setStatusMessage(err.message || "Failed to start session.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleScanNextStudent = () => {
    if (!sessionActive) {
      return;
    }
    setLastScanName("None");
    setStatusMessage("Ready for next student.");
  };

  const handleEndSession = async () => {
    if (!sessionActive) {
      return;
    }

    setSessionActive(false);
    stopRecognitionLoop();
    stopWebcam();
    setStatusMessage("Closing database session...");

    try {
      await closeAttendanceSessionAction(courseId);
      setStatusMessage("Session successfully ended.");
    } catch (e) {
      setStatusMessage("Camera off, but failed to securely close the session.");
    }

    // Clear state
    presentIdsRef.current = new Set();
    setPresentIds(new Set());
    setLastScanName("None");
    templatesRef.current = [];
    setTemplates([]);
  };

  return (
    <InstructorPageFrame activeNav="take-attendance">
      <div className="take-attendance-page instructor-page-content">
        <header className="pageHeader">
          <h1>Take Attendance</h1>
          <p>Daily attendance scanning during class</p>
        </header>

        <div className="takeGrid">
          <div className="takeControlsColumn">
            <section className="controlCard">
              <div className="sectionTitle">
                <span className="stepBadge">1</span>
                <h2>Select Course</h2>
              </div>
              
              {isFaceApiLoading && <p style={{ color: "var(--accent-teal)", marginBottom: "1rem", fontSize: "0.875rem" }}>Loading AI Models...</p>}

              <div className="fieldBlock">
                <label htmlFor="active-course">Course</label>
                <div className="selectField">
                  <select
                    id="active-course"
                    value={courseId}
                    onChange={(event) => {
                      setCourseId(event.target.value);
                      setStatusMessage("");
                    }}
                    disabled={sessionActive || isStarting || isRoleChecking}
                  >
                    <option value="" disabled>Select one of your assigned courses</option>
                    {instructorCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              {!sessionActive ? (
                <button
                  type="button"
                  className="primaryAction"
                  onClick={handleStartSession}
                  disabled={
                    !isModelLoaded ||
                    isStarting ||
                    !courseId ||
                    isRoleChecking ||
                    !isAuthorized
                  }
                >
                  <PlayIcon />
                  <span>{isStarting ? "Starting..." : "Start Session"}</span>
                </button>
              ) : (
                <button type="button" className="secondaryAction disabledAction" disabled>
                  <PlayIcon />
                  <span>Session Active</span>
                </button>
              )}
              
              {statusMessage && <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--subtext)' }}>{statusMessage}</p>}
            </section>

            <section className={`controlCard ${sessionActive ? '' : 'mutedCard'}`}>
              <div className="sectionTitle">
                <span className={`stepBadge ${sessionActive ? '' : 'muted'}`}>2</span>
                <h2>Session Controls</h2>
              </div>

              <button
                type="button"
                className={`secondaryAction ${sessionActive ? '' : 'disabledAction'}`}
                disabled={!sessionActive}
                onClick={handleScanNextStudent}
              >
                <RotateIcon />
                <span>Scan Next Student</span>
              </button>

              <button type="button" className="secondaryAction dangerAction" onClick={handleEndSession} disabled={!sessionActive}>
                <StopIcon />
                <span>End Session</span>
              </button>
            </section>
          </div>

          <div className="scanColumn">
            <section className="cameraCard" style={{ overflow: "hidden" }}>
              <div className="cameraStatus">
                <span className="statusDot" style={{ backgroundColor: sessionActive ? '#4caf50' : '#ffa000' }} />
                <span>{sessionActive ? 'ACTIVE' : 'STANDBY'}</span>
              </div>

              {!sessionActive && (
                <div className="cameraPlaceholder">
                  <CameraOffIcon />
                  <h3>Camera Feed Placeholder</h3>
                  <p>Start session to activate camera</p>
                </div>
              )}

              <video 
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  display: sessionActive ? "block" : "none",
                  transform: "scaleX(-1)"
                }}
                muted
                playsInline
              />
            </section>

            <section className="awaitCard">
              <div className="awaitIconBox">
                <ScanAwaitIcon />
              </div>
              <h3>{sessionActive ? 'Scanning Area' : 'Awaiting Scan'}</h3>
              <p>
                Position the student&apos;s face in front of the
                <br />
                camera to verify identity.
              </p>
            </section>
          </div>
        </div>

        <footer className="scanFooterBar">
          <div className="scanFooterStats">
            <span className="footerStat">
              <span className="footerDot present" />
              Present: {presentIds.size}
            </span>
            <span className="footerStat">
              <span className="footerDot enrolled" />
              Enrolled: {templates.length}
            </span>
          </div>

          <p className="lastScanText">Last scan: {lastScanName}</p>
        </footer>
      </div>
    </InstructorPageFrame>
  );
}
