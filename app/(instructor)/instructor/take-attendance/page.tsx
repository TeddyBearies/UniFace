"use client";

import InstructorPageFrame from "@/components/InstructorPageFrame";
import { useState, useRef, useEffect, useCallback } from "react";
import { useFaceApi } from "@/features/face/useFaceApi";
import { useClientRoleGuard } from "@/features/auth/useClientRoleGuard";
import { getCourseFaceTemplatesAction, markAttendanceAction } from "@/features/face/face.service";
import { getInstructorCoursesAction } from "@/features/courses/course.service";
import { startAttendanceSessionAction, closeAttendanceSessionAction } from "@/features/attendance/attendance.service";
import { verifyCurrentUserPassword } from "@/features/auth/verify-current-password";
import { useLockedScanMode } from "@/features/attendance/useLockedScanMode";
import * as faceapi from "face-api.js";

type ScanFeedback = {
  kind: "idle" | "scanning" | "no-face" | "unknown" | "duplicate" | "success" | "late" | "error";
  title: string;
  detail: string;
  studentName?: string;
  studentId?: string;
  courseLabel?: string;
  sessionLabel?: string;
  scanTime?: string;
  lateMinutes?: number | null;
};

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

function SuccessPulseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5.5-6" />
    </svg>
  );
}

function WarningPulseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5" />
      <path d="M12 15.5h.01" />
    </svg>
  );
}

function ErrorPulseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 8.5 7 7" />
      <path d="m15.5 8.5-7 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <path d="M8 3H3v5" />
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M16 21h5v-5" />
      <path d="m3 3 6 6" />
      <path d="m21 3-6 6" />
      <path d="m3 21 6-6" />
      <path d="m21 21-6-6" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <path d="M14 7V5.5A1.5 1.5 0 0 0 12.5 4h-7A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20h7a1.5 1.5 0 0 0 1.5-1.5V17" />
      <path d="M10 12h10" />
      <path d="m17 8 3 4-3 4" />
    </svg>
  );
}

function FaceGuideOverlay() {
  return (
    <div className="faceGuideOverlay" aria-hidden="true">
      <span className="faceGuideCorner faceGuideCornerTopLeft" />
      <span className="faceGuideCorner faceGuideCornerTopRight" />
      <span className="faceGuideCorner faceGuideCornerBottomLeft" />
      <span className="faceGuideCorner faceGuideCornerBottomRight" />
      <span className="faceGuideCenterLine faceGuideCenterVertical" />
      <span className="faceGuideCenterLine faceGuideCenterHorizontal" />
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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
  const {
    isLockedMode,
    setIsLockedMode,
    isBrowserFullscreen,
    requestBrowserFullscreen,
    exitBrowserFullscreen,
  } = useLockedScanMode({ defaultEnabled: false });

  const [courseId, setCourseId] = useState("");
  const [attendanceSessionId, setAttendanceSessionId] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [templates, setTemplates] = useState<
    Array<{
      studentProfileId: string;
      fullName: string;
      universityId: string;
      descriptor: Float32Array;
    }>
  >([]);
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [lateIds, setLateIds] = useState<Set<string>>(new Set());
  const [lastScanName, setLastScanName] = useState("None");
  const [sessionStartedAt, setSessionStartedAt] = useState("");
  const [lastScanRecord, setLastScanRecord] = useState<{
    studentName: string;
    scanTime: string;
    status: "Present" | "Late" | "Duplicate";
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [pendingProtectedAction, setPendingProtectedAction] = useState<
    "start-session" | "end-session" | "exit-lock" | null
  >(null);
  const [scanFeedback, setScanFeedback] = useState<ScanFeedback>({
    kind: "idle",
    title: "Waiting to start",
    detail: "Select a course and start the session to begin scanning.",
  });

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
  const attendanceSessionIdRef = useRef(attendanceSessionId);
  const scanFeedbackRef = useRef(scanFeedback);

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

  useEffect(() => {
    attendanceSessionIdRef.current = attendanceSessionId;
  }, [attendanceSessionId]);

  useEffect(() => {
    scanFeedbackRef.current = scanFeedback;
  }, [scanFeedback]);

  const setScanOutcome = useCallback((next: ScanFeedback) => {
    if (
      next.kind === "no-face" &&
      scanFeedbackRef.current.kind === "no-face" &&
      scanFeedbackRef.current.detail === next.detail
    ) {
      return;
    }

    if (
      next.kind === "unknown" &&
      scanFeedbackRef.current.kind === "unknown" &&
      scanFeedbackRef.current.detail === next.detail
    ) {
      return;
    }

    setScanFeedback(next);
  }, []);

  // Provide cached AudioContext to bypass user-gesture restrictions safely across multiple calls after first unlock
  const [, setForceAudioRender] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined" || !("AudioContext" in window)) return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  const playSuccessTone = useCallback(() => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.03;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.14);
    } catch {
      // ignore audio failures on unsupported browsers
    }
  }, [getAudioContext]);

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

  useEffect(() => {
    if (!isLockedMode) {
      setShowUnlockDialog(false);
      setUnlockPassword("");
      setUnlockError("");
      setPendingProtectedAction(null);
      return;
    }

    requestBrowserFullscreen();
  }, [isLockedMode, requestBrowserFullscreen]);

  useEffect(() => {
    if (!isLockedMode) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowUnlockDialog(true);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [isLockedMode]);

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

  const handleEnterLockedMode = useCallback(async () => {
    setIsLockedMode(true);
    await requestBrowserFullscreen();
  }, [requestBrowserFullscreen, setIsLockedMode]);

  const handleOpenUnlockDialog = (action: "start-session" | "end-session" | "exit-lock") => {
    setUnlockPassword("");
    setUnlockError("");
    setPendingProtectedAction(action);
    setShowUnlockDialog(true);
  };

  // Recognition loop
  const runRecognition = useCallback(async () => {
    if (!sessionActiveRef.current) {
      return;
    }

    try {
      const detections = await detectFaces();
      if (!detections || detections.length === 0) {
        setScanOutcome({
          kind: "no-face",
          title: "No face detected",
          detail: "Keep the student's face in the frame and make sure the camera is well lit.",
        });
        return;
      }

      for (const detection of detections) {
        let bestMatch: (typeof templatesRef.current)[number] | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        let secondBestDistance = Number.POSITIVE_INFINITY;

        for (const template of templatesRef.current) {
          const distance = faceapi.euclideanDistance(
            detection.descriptor,
            template.descriptor,
          );
          if (distance < bestDistance) {
            secondBestDistance = bestDistance;
            bestDistance = distance;
            bestMatch = template;
            continue;
          }

          if (distance < secondBestDistance) {
            secondBestDistance = distance;
          }
        }

        if (!bestMatch) {
          setScanOutcome({
            kind: "unknown",
            title: "Unknown face",
            detail: "A face was detected, but it did not match any enrolled student for this session.",
          });
          continue;
        }

        // We require both a solid absolute distance and a meaningful gap from the
        // second-best match. That keeps the kiosk from marking attendance when two
        // students look similar or the frame is noisy.
        if (bestDistance > 0.5 || secondBestDistance - bestDistance < 0.035) {
          setScanOutcome({
            kind: "unknown",
            title: "Unknown face",
            detail: "A face was detected, but the match confidence was not strong enough to record attendance.",
          });
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
          const result = await markAttendanceAction(
            attendanceSessionIdRef.current,
            matchedStudentId,
            Math.max(0, 1 - bestDistance),
          );

          if (result?.message?.toLowerCase().includes("already")) {
            const selectedCourse = instructorCourses.find((course) => course.id === courseIdRef.current);
            const duplicateTime = formatDateTime(new Date().toISOString());
            setScanOutcome({
              kind: "duplicate",
              title: "Already recorded",
              detail: "This student has already been marked present in the current session.",
              studentName: bestMatch.fullName,
              studentId: bestMatch.universityId,
              courseLabel: selectedCourse
                ? `${selectedCourse.code} - ${selectedCourse.title}`
                : courseIdRef.current,
              sessionLabel: "Current session",
              scanTime: duplicateTime,
            });
            setLastScanRecord({
              studentName: bestMatch.fullName,
              scanTime: duplicateTime,
              status: "Duplicate",
            });
            setStatusMessage("This student was already recorded for the current session.");
            continue;
          }

          presentIdsRef.current = new Set(presentIdsRef.current).add(matchedStudentId);
          setPresentIds(new Set(presentIdsRef.current));
          setLastScanName(`${bestMatch.fullName} (${bestMatch.universityId})`);
          const scanTime = result.recordedAt || new Date().toISOString();
          const courseLabel = `${result.courseCode} - ${result.courseTitle}`;
          const sessionLabel = `Started ${formatDateTime(result.sessionStartsAt)}`;
          const isLate = result.status === "Late";
          setLateIds((previous) => {
            const next = new Set(previous);
            if (isLate) {
              next.add(matchedStudentId);
            } else {
              next.delete(matchedStudentId);
            }
            return next;
          });
          setLastScanRecord({
            studentName: result.studentName,
            scanTime: formatDateTime(scanTime),
            status: isLate ? "Late" : "Present",
          });

          setScanOutcome({
            kind: isLate ? "late" : "success",
            title: isLate ? "Attendance recorded as Late" : "Attendance recorded successfully",
            detail: isLate
              ? `Late by ${result.lateMinutes ?? 0} minutes`
              : "Student matched and attendance saved.",
            studentName: result.studentName,
            studentId: result.studentId,
            courseLabel,
            sessionLabel,
            scanTime: formatDateTime(scanTime),
            lateMinutes: result.lateMinutes,
          });
          playSuccessTone();
          setStatusMessage(
            isLate
              ? `${result.studentName} marked late at ${formatDateTime(scanTime)}.`
              : `${result.studentName} marked present at ${formatDateTime(scanTime)}.`,
          );
        } catch (error: any) {
          console.error("Failed to mark attendance:", error);
          const message = error?.message || "Failed to mark attendance for a detected face.";
          setStatusMessage(message);
          if (message.toLowerCase().includes("already")) {
            setScanOutcome({
              kind: "duplicate",
              title: "Already recorded",
              detail: "This student has already been marked present in the current session.",
            });
          } else if (message.toLowerCase().includes("not actively enrolled")) {
            setScanOutcome({
              kind: "error",
              title: "Enrollment mismatch",
              detail: message,
            });
          } else {
            setScanOutcome({
              kind: "error",
              title: "Scan failed",
              detail: message,
            });
          }
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
        }, 120);
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
    setLateIds(new Set());
    setLastScanName("None");
    setLastScanRecord(null);
    setSessionStartedAt("");
    setStatusMessage("Fetching face templates for course...");
    setScanOutcome({
      kind: "scanning",
      title: "Preparing session",
      detail: "Loading enrolled faces and creating the live attendance session.",
    });
    let openedNewSession = false;
    let startedSessionId = "";
    setAttendanceSessionId("");

    try {
      // 1. Fetch the embedded descriptors securely
      const faceData = await getCourseFaceTemplatesAction(courseId);
      if (faceData.templates.length === 0) {
        if (faceData.activeEnrollmentCount === 0) {
          setStatusMessage("No students are actively enrolled in this course yet.");
          setScanOutcome({
            kind: "error",
            title: "No roster found",
            detail: "This course has no active student enrollments yet.",
          });
        } else if (faceData.faceReadyCount === 0) {
          setStatusMessage(
            "Students are enrolled in this course, but none of them have completed face enrollment yet.",
          );
          setScanOutcome({
            kind: "unknown",
            title: "No enrolled faces",
            detail: "Students are on the roster, but none have completed face enrollment yet.",
          });
        } else {
          setStatusMessage(
            "Students with completed face enrollment were found, but their face templates could not be loaded.",
          );
          setScanOutcome({
            kind: "error",
            title: "Templates unavailable",
            detail: "Enrolled faces exist, but the recognition templates could not be loaded.",
          });
        }
        templatesRef.current = [];
        setTemplates([]);
        return;
      }
      const recognitionTemplates = faceData.templates.map((template) => ({
        studentProfileId: template.studentProfileId,
        fullName: template.fullName,
        universityId: template.universityId,
        descriptor: new Float32Array(template.descriptorArray),
      }));
      templatesRef.current = recognitionTemplates;
      setTemplates(recognitionTemplates);

      // 2. Securely create or fetch to an open attendance session in DB
      setStatusMessage("Initiating attendance session...");
      const sessionResult = await startAttendanceSessionAction(courseId);
      openedNewSession = sessionResult.isNew;
      startedSessionId = sessionResult.sessionId;
      attendanceSessionIdRef.current = sessionResult.sessionId;
      setAttendanceSessionId(sessionResult.sessionId);
      presentIdsRef.current = new Set(sessionResult.presentStudentIds);
      setPresentIds(new Set(sessionResult.presentStudentIds));
      setLateIds(new Set());
      setSessionStartedAt(new Date().toISOString());

      // 3. Start scanning module
      setStatusMessage("Starting camera...");
      await loadWebcam();
      setSessionActive(true);
      setScanOutcome({
        kind: "scanning",
        title: "Scanning started",
        detail: "The camera is active and ready to recognize enrolled students.",
      });
      setStatusMessage(
        sessionResult.presentStudentIds.length > 0
          ? `Session resumed. ${sessionResult.presentStudentIds.length} students already recorded.`
          : "Session running. Scanning...",
      );
    } catch (err: any) {
      stopWebcam();
      setSessionActive(false);
      attendanceSessionIdRef.current = "";
      setAttendanceSessionId("");

      // If the database session was opened but the camera/template setup failed,
      // we close it right away so instructors do not end up with orphaned "open" sessions.
      if (openedNewSession) {
        try {
          if (startedSessionId) {
            await closeAttendanceSessionAction(startedSessionId);
          }
        } catch (closeError) {
          console.error("Failed to rollback session start:", closeError);
        }
      }

      const message = err.message || "Failed to start session.";
      setStatusMessage(message);
      setScanOutcome({
        kind: "error",
        title: "Session failed",
        detail: message,
      });
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
    setScanOutcome({
      kind: "scanning",
      title: "Ready for the next student",
      detail: "Hold the next face in front of the camera to record attendance.",
    });
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
      await closeAttendanceSessionAction(attendanceSessionId);
      setStatusMessage("Session successfully ended.");
    } catch (e) {
      setStatusMessage("Camera off, but failed to securely close the session.");
    }

    // Clear state
    presentIdsRef.current = new Set();
    setPresentIds(new Set());
    setLateIds(new Set());
    setLastScanName("None");
    setLastScanRecord(null);
    setSessionStartedAt("");
    templatesRef.current = [];
    setTemplates([]);
    attendanceSessionIdRef.current = "";
    setAttendanceSessionId("");
    setScanOutcome({
      kind: "idle",
      title: "Session ended",
      detail: "Select a course to start a new attendance session.",
    });
  };

  const handleProtectedStartSession = useCallback(async () => {
    if (isLockedMode) {
      handleOpenUnlockDialog("start-session");
      return;
    }

    await handleStartSession();
  }, [handleStartSession, isLockedMode]);

  const handleProtectedEndSession = useCallback(async () => {
    if (isLockedMode) {
      handleOpenUnlockDialog("end-session");
      return;
    }

    await handleEndSession();
  }, [handleEndSession, isLockedMode]);

  const handleUnlockLockedMode = useCallback(async () => {
    if (isUnlocking) {
      return;
    }

    setIsUnlocking(true);
    setUnlockError("");

    try {
      const result = await verifyCurrentUserPassword(unlockPassword);
      if (!result.ok) {
        setUnlockError(result.error);
        return;
      }

      setShowUnlockDialog(false);
      setUnlockPassword("");
      const action = pendingProtectedAction;
      setPendingProtectedAction(null);

      // Locked mode gates sensitive actions behind a fresh password check instead
      // of trusting the existing browser session alone.
      if (action === "exit-lock") {
        setIsLockedMode(false);
        await exitBrowserFullscreen();
        setStatusMessage("Locked mode disabled by instructor verification.");
        return;
      }

      if (action === "start-session") {
        await handleStartSession();
        return;
      }

      if (action === "end-session") {
        await handleEndSession();
      }
    } finally {
      setIsUnlocking(false);
    }
  }, [
    exitBrowserFullscreen,
    handleEndSession,
    handleStartSession,
    isUnlocking,
    pendingProtectedAction,
    setIsLockedMode,
    unlockPassword,
  ]);

  const selectedCourse = instructorCourses.find((course) => course.id === courseId);
  const sessionCourseLabel = selectedCourse
    ? `${selectedCourse.code} - ${selectedCourse.title}`
    : "No course selected";
  const totalScanned = presentIds.size;
  const lateCount = lateIds.size;
  const presentCount = Math.max(totalScanned - lateCount, 0);
  const scanStatusLabel = lastScanRecord ? lastScanRecord.status : "No scans yet";
  const lastScanLabel = lastScanRecord
    ? `${lastScanRecord.studentName} at ${lastScanRecord.scanTime}`
    : "Waiting for first successful scan";

  return (
    <InstructorPageFrame activeNav="take-attendance">
      <div
        className={`take-attendance-page instructor-page-content ${
          isLockedMode ? "takeLockedMode" : ""
        }`}
      >
        {!isLockedMode && (
          <header className="pageHeader">
            <h1>Take Attendance</h1>
            <p>Session-based attendance scanning during class</p>
            <button
              type="button"
              className="takeEnterLockedModeButton"
              onClick={handleEnterLockedMode}
            >
              <ExpandIcon />
              <span>Enter Locked Tablet Mode</span>
            </button>
          </header>
        )}

        {isLockedMode ? (
          <section className="takeLockedShell">
            <section className="cameraCard takeLockedCameraCard">
              <div className="cameraStatus">
                <span
                  className="statusDot"
                  style={{ backgroundColor: sessionActive ? "#4caf50" : "#ffa000" }}
                />
                <span>{sessionActive ? "ACTIVE" : "STANDBY"}</span>
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
                  height: "100%",
                  objectFit: "cover",
                  display: sessionActive ? "block" : "none",
                  transform: "scaleX(-1)",
                  position: "absolute",
                  inset: 0,
                }}
                muted
                playsInline
              />
              <FaceGuideOverlay />

              <div className={`scanFeedbackCard takeLockedFeedback scanFeedback${scanFeedback.kind}`}>
                <div className="scanFeedbackHeader">
                  <div className="scanFeedbackIcon">
                    {scanFeedback.kind === "success" || scanFeedback.kind === "late" ? (
                      <SuccessPulseIcon />
                    ) : scanFeedback.kind === "unknown" ? (
                      <WarningPulseIcon />
                    ) : scanFeedback.kind === "duplicate" || scanFeedback.kind === "error" ? (
                      <ErrorPulseIcon />
                    ) : (
                      <ScanAwaitIcon />
                    )}
                  </div>
                  <div className="scanFeedbackCopy">
                    <span className="scanFeedbackBadge">{scanFeedback.kind.replace("-", " ")}</span>
                    <h3>{scanFeedback.title}</h3>
                  </div>
                </div>
                <p className="scanFeedbackDetail">{scanFeedback.detail}</p>
              </div>
            </section>

            <aside className="takeLockedSidebar">
              <div className="takeLockedHeader">
                <div>
                  <h2>Locked Scan Mode</h2>
                  <p>Tablet attendance kiosk</p>
                </div>
                <span className="takeLockedShield">
                  <LockIcon />
                  Locked
                </span>
              </div>

              <div className="takeLockedSidebarContent">
                <div className="takeLockedStats">
                  <div>
                  <span>Course</span>
                  <strong>{sessionCourseLabel}</strong>
                </div>
                <div>
                  <span>Session Start</span>
                  <strong>{sessionStartedAt ? formatDateTime(sessionStartedAt) : "Not started"}</strong>
                </div>
                <div>
                  <span>Total Scanned</span>
                  <strong>{totalScanned}</strong>
                </div>
                <div>
                  <span>Present</span>
                  <strong>{presentCount}</strong>
                </div>
                <div>
                  <span>Late</span>
                  <strong>{lateCount}</strong>
                </div>
                <div>
                  <span>Last Scan Status</span>
                  <strong>{scanStatusLabel}</strong>
                </div>
                <div className="takeLockedLastScan">
                  <span>Last Scanned Student</span>
                  <strong>{lastScanLabel}</strong>
                </div>
              </div>

              <div className="takeLockedControlCard">
                <label htmlFor="active-course-locked">Course</label>
                <div className="selectField">
                  <select
                    id="active-course-locked"
                    value={courseId}
                    onChange={(event) => {
                      setCourseId(event.target.value);
                      setAttendanceSessionId("");
                      setStatusMessage("");
                      setScanOutcome({
                        kind: "idle",
                        title: "Waiting to start",
                        detail: "Select a course and start the session to begin scanning.",
                      });
                    }}
                    disabled={sessionActive || isStarting || isRoleChecking}
                  >
                    <option value="" disabled>
                      Select one of your assigned courses
                    </option>
                    {instructorCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>

                <button
                  type="button"
                  className={`primaryAction ${sessionActive ? "disabledAction" : ""}`}
                  onClick={handleStartSession}
                  disabled={
                    sessionActive ||
                    !isModelLoaded ||
                    isStarting ||
                    !courseId ||
                    isRoleChecking ||
                    !isAuthorized
                  }
                >
                  <PlayIcon />
                  <span>{sessionActive ? "Session Active" : isStarting ? "Starting..." : "Start Session"}</span>
                </button>

                <button
                  type="button"
                  className={`takeLockedDarkAction secondaryAction ${sessionActive ? "" : "disabledAction"}`}
                  disabled={!sessionActive}
                  onClick={handleScanNextStudent}
                >
                  <RotateIcon />
                  <span>Scan Next Student</span>
                </button>

                <button
                  type="button"
                  className="takeLockedDarkAction secondaryAction dangerAction"
                  onClick={handleProtectedEndSession}
                  disabled={!sessionActive}
                >
                  <StopIcon />
                  <span>End Session</span>
                </button>
              </div>

              {statusMessage && <p className="takeLockedStatusMessage">{statusMessage}</p>}
              </div>

              <div className="takeLockedExitActions">
                {!isBrowserFullscreen && (
                  <button type="button" className="takeLockedUtilityButton" onClick={requestBrowserFullscreen}>
                    <ExpandIcon />
                    <span>Enable Browser Fullscreen</span>
                  </button>
                )}
                <button
                  type="button"
                  className="takeLockedUtilityButton takeLockedExitButton"
                  onClick={() => handleOpenUnlockDialog("exit-lock")}
                >
                  <ExitIcon />
                  <span>Exit Locked Mode</span>
                </button>
              </div>
            </aside>
          </section>
        ) : (
          <>
            <div className="takeGrid">
              <div className="takeControlsColumn">
                <section className="controlCard">
                  <div className="sectionTitle">
                    <span className="stepBadge">1</span>
                    <h2>Select Course</h2>
                  </div>

                  {isFaceApiLoading && (
                    <p style={{ color: "var(--accent-teal)", marginBottom: "1rem", fontSize: "0.875rem" }}>
                      Loading AI Models...
                    </p>
                  )}

                  <div className="fieldBlock">
                    <label htmlFor="active-course">Course</label>
                    <div className="selectField">
                      <select
                        id="active-course"
                        value={courseId}
                        onChange={(event) => {
                          setCourseId(event.target.value);
                          setAttendanceSessionId("");
                          setStatusMessage("");
                          setScanOutcome({
                            kind: "idle",
                            title: "Waiting to start",
                            detail: "Select a course and start the session to begin scanning.",
                          });
                        }}
                        disabled={sessionActive || isStarting || isRoleChecking}
                      >
                        <option value="" disabled>
                          Select one of your assigned courses
                        </option>
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
                      onClick={handleProtectedStartSession}
                      disabled={
                        !isModelLoaded || isStarting || !courseId || isRoleChecking || !isAuthorized
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

                  {statusMessage && (
                    <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--subtext)" }}>
                      {statusMessage}
                    </p>
                  )}

                  <div className={`scanFeedbackCard scanFeedback${scanFeedback.kind}`}>
                    <div className="scanFeedbackHeader">
                      <div className="scanFeedbackIcon">
                        {scanFeedback.kind === "success" || scanFeedback.kind === "late" ? (
                          <SuccessPulseIcon />
                        ) : scanFeedback.kind === "unknown" ? (
                          <WarningPulseIcon />
                        ) : scanFeedback.kind === "duplicate" || scanFeedback.kind === "error" ? (
                          <ErrorPulseIcon />
                        ) : (
                          <ScanAwaitIcon />
                        )}
                      </div>
                      <div className="scanFeedbackCopy">
                        <span className="scanFeedbackBadge">{scanFeedback.kind.replace("-", " ")}</span>
                        <h3>{scanFeedback.title}</h3>
                      </div>
                    </div>

                    <p className="scanFeedbackDetail">{scanFeedback.detail}</p>

                    {(scanFeedback.studentName || scanFeedback.studentId || scanFeedback.scanTime) && (
                      <div className="scanFeedbackGrid">
                        {scanFeedback.studentName && (
                          <div>
                            <span>Student</span>
                            <strong>{scanFeedback.studentName}</strong>
                          </div>
                        )}
                        {scanFeedback.studentId && (
                          <div>
                            <span>Student ID</span>
                            <strong>{scanFeedback.studentId}</strong>
                          </div>
                        )}
                        {scanFeedback.courseLabel && (
                          <div>
                            <span>Course</span>
                            <strong>{scanFeedback.courseLabel}</strong>
                          </div>
                        )}
                        {scanFeedback.sessionLabel && (
                          <div>
                            <span>Session</span>
                            <strong>{scanFeedback.sessionLabel}</strong>
                          </div>
                        )}
                        {scanFeedback.scanTime && (
                          <div>
                            <span>Scan Time</span>
                            <strong>{scanFeedback.scanTime}</strong>
                          </div>
                        )}
                        {(scanFeedback.kind === "late" || typeof scanFeedback.lateMinutes === "number") && (
                          <div>
                            <span>Status</span>
                            <strong>
                              Late
                              {typeof scanFeedback.lateMinutes === "number"
                                ? ` (${scanFeedback.lateMinutes} min late)`
                                : ""}
                            </strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                <section className={`controlCard ${sessionActive ? "" : "mutedCard"}`}>
                  <div className="sectionTitle">
                    <span className={`stepBadge ${sessionActive ? "" : "muted"}`}>2</span>
                    <h2>Session Controls</h2>
                  </div>

                  <button
                    type="button"
                    className={`secondaryAction ${sessionActive ? "" : "disabledAction"}`}
                    disabled={!sessionActive}
                    onClick={handleScanNextStudent}
                  >
                    <RotateIcon />
                    <span>Scan Next Student</span>
                  </button>

                  <button
                    type="button"
                    className="secondaryAction dangerAction"
                    onClick={handleProtectedEndSession}
                    disabled={!sessionActive}
                  >
                    <StopIcon />
                    <span>End Session</span>
                  </button>
                </section>
              </div>

              <div className="scanColumn">
                <section className="cameraCard" style={{ overflow: "hidden" }}>
                  <div className="cameraStatus">
                    <span
                      className="statusDot"
                      style={{ backgroundColor: sessionActive ? "#4caf50" : "#ffa000" }}
                    />
                    <span>{sessionActive ? "ACTIVE" : "STANDBY"}</span>
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
                      height: "100%",
                      objectFit: "cover",
                      display: sessionActive ? "block" : "none",
                      transform: "scaleX(-1)",
                      position: "absolute",
                      inset: 0,
                    }}
                    muted
                    playsInline
                  />
                  <FaceGuideOverlay />
                </section>

                <section className="awaitCard">
                  <div className="awaitIconBox">
                    <ScanAwaitIcon />
                  </div>
                  <h3>{sessionActive ? "Scanning Area" : "Awaiting Scan"}</h3>
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
                  Present: {presentCount}
                </span>
                <span className="footerStat">
                  <span className="footerDot enrolled" />
                  Enrolled: {templates.length}
                </span>
                <span className="footerStat">
                  <span className="footerDot" style={{ background: "#f59e0b" }} />
                  Late: {lateCount}
                </span>
              </div>

              <p className="lastScanText">Last scan: {lastScanName}</p>
            </footer>
          </>
        )}

        {showUnlockDialog && (
          <div className="takeUnlockOverlay" role="dialog" aria-modal="true">
            <div className="takeUnlockDialog">
              <h3>Instructor Verification Required</h3>
              <p>Enter your account password to exit locked scanning mode.</p>
              <label htmlFor="unlock-password">Password</label>
              <input
                id="unlock-password"
                type="password"
                value={unlockPassword}
                onChange={(event) => setUnlockPassword(event.target.value)}
                placeholder="Enter your password"
                autoFocus
              />
              {unlockError && <p className="takeUnlockError">{unlockError}</p>}
              <div className="takeUnlockActions">
                <button
                  type="button"
                  className="takeUnlockCancel"
                  onClick={() => setShowUnlockDialog(false)}
                  disabled={isUnlocking}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="takeUnlockConfirm"
                  onClick={handleUnlockLockedMode}
                  disabled={isUnlocking || !unlockPassword.trim()}
                >
                  {isUnlocking ? "Verifying..." : "Unlock and Exit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorPageFrame>
  );
}
