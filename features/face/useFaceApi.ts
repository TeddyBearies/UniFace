"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";
const TINY_FACE_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 224,
  scoreThreshold: 0.45,
});
const ENROLLMENT_FACE_OPTIONS = new faceapi.SsdMobilenetv1Options({
  minConfidence: 0.4,
});

export function useFaceApi() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // References to video and canvas, typically attached to refs in the component
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    let mounted = true;

    async function loadModels() {
      try {
        setIsLoading(true);
        setError(null);
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);
        
        if (mounted) {
          setIsModelLoaded(true);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load face-api models.");
          console.error("Face-api model load error:", err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadModels();

    return () => {
      mounted = false;
    };
  }, []);

  const loadWebcam = useCallback(async () => {
    if (!videoRef.current) {
      throw new Error("Camera element is not ready.");
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          aspectRatio: { ideal: 4 / 3 },
          frameRate: { ideal: 24, max: 30 },
        },
        audio: false,
      });
      setStream(stream);
      videoRef.current.srcObject = stream;
      
      // Return a promise that resolves when video plays
      await new Promise<void>((resolve, reject) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            resolve();
          };
          videoRef.current.onerror = () => {
            reject(new Error("Failed to initialize webcam stream."));
          };
        } else {
          reject(new Error("Camera element is not ready."));
        }
      });
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to access webcam.");
      console.error("Webcam error:", err);
      throw err;
    }
  }, []);

  const stopWebcam = useCallback(() => {
    setStream((currentStream) => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      return null;
    });

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.onloadedmetadata = null;
      if (videoRef.current.srcObject) {
        const str = videoRef.current.srcObject as MediaStream;
        str.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(() => {});
      };
    }
  });

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  const detectSingleFace = useCallback(async (): Promise<{ descriptor: Float32Array; warning?: string; }> => {
    if (!videoRef.current || !isModelLoaded) {
      throw new Error("Webcam or models not ready.");
    }

    if (videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      throw new Error("Camera feed is not ready yet.");
    }

    // Attempt to detect all faces to check for multiple people
    const detections = await faceapi
      .detectAllFaces(videoRef.current, ENROLLMENT_FACE_OPTIONS)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length === 0) {
      throw new Error("No face detected.");
    }

    if (detections.length > 1) {
      throw new Error("Multiple faces detected. Please ensure only one person is in frame.");
    }

    return {
      descriptor: detections[0].descriptor,
    };
  }, [isModelLoaded]);

  // Performs a single quick detection, mainly used in a loop for attendance
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !isModelLoaded) return [];
    if (videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return [];
    }

    const detections = await faceapi
      .detectAllFaces(videoRef.current, TINY_FACE_OPTIONS)
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections;
  }, [isModelLoaded]);

  return {
    isModelLoaded,
    isLoading,
    error,
    videoRef,
    loadWebcam,
    stopWebcam,
    detectSingleFace,
    detectFaces,
  };
}
