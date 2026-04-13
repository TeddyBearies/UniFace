"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

export function useFaceApi() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        video: { facingMode: "user" },
        audio: false,
      });
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
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.pause();
      videoRef.current.onloadedmetadata = null;
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  const detectSingleFace = useCallback(async (): Promise<{ descriptor: Float32Array; warning?: string; }> => {
    if (!videoRef.current || !isModelLoaded) {
      throw new Error("Webcam or models not ready.");
    }

    // Attempt to detect all faces to check for multiple people
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options()) // SSD is more accurate for extracting descriptors
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

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
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
