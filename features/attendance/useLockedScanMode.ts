"use client";

import { useCallback, useEffect, useState } from "react";

type UseLockedScanModeOptions = {
  defaultEnabled?: boolean;
};

export function useLockedScanMode(options: UseLockedScanModeOptions = {}) {
  const { defaultEnabled = false } = options;
  const [isLockedMode, setIsLockedMode] = useState(defaultEnabled);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  const requestBrowserFullscreen = useCallback(async () => {
    if (typeof document === "undefined") {
      return false;
    }

    const rootElement = document.documentElement;
    if (!rootElement?.requestFullscreen) {
      return false;
    }

    if (document.fullscreenElement) {
      return true;
    }

    try {
      await rootElement.requestFullscreen({ navigationUI: "hide" } as FullscreenOptions);
      return true;
    } catch {
      return false;
    }
  }, []);

  const exitBrowserFullscreen = useCallback(async () => {
    if (typeof document === "undefined") {
      return false;
    }

    if (!document.fullscreenElement || !document.exitFullscreen) {
      return false;
    }

    try {
      await document.exitFullscreen();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (isLockedMode) {
      document.body.classList.add("scan-locked-mode-active");
    } else {
      document.body.classList.remove("scan-locked-mode-active");
    }

    return () => {
      document.body.classList.remove("scan-locked-mode-active");
    };
  }, [isLockedMode]);

  useEffect(() => {
    if (!isLockedMode || typeof window === "undefined") {
      return;
    }

    const lockCurrentHistoryEntry = () => {
      window.history.pushState({ lockedScanMode: true }, "", window.location.href);
    };

    const handlePopState = () => {
      lockCurrentHistoryEntry();
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    lockCurrentHistoryEntry();
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLockedMode]);

  return {
    isLockedMode,
    setIsLockedMode,
    isBrowserFullscreen,
    requestBrowserFullscreen,
    exitBrowserFullscreen,
  };
}
