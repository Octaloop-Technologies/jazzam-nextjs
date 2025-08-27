"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Extend XMLHttpRequest with custom properties
declare global {
  interface XMLHttpRequest {
    __requestId?: string;
    __method?: string;
    __url?: string;
  }
}

// Network request tracker
type RequestInfo = {
  id: string;
  startTime: number;
  endTime?: number;
  url: string;
  method: string;
  completed: boolean;
};

// Lazy-loaded network tracker to avoid affecting initial page load
let networkTrackerInstance: NetworkTracker | null = null;

class NetworkTracker {
  private static instance: NetworkTracker;
  private requests: Map<string, RequestInfo> = new Map();
  private listeners: Set<(activeRequests: RequestInfo[]) => void> = new Set();
  private originalFetch: typeof fetch;
  private originalXHROpen: typeof XMLHttpRequest.prototype.open;
  private originalXHRSend: typeof XMLHttpRequest.prototype.send;
  private initialized = false;

  private constructor() {
    // Use window.fetch instead of global.fetch for browser compatibility
    this.originalFetch = window.fetch;
    this.originalXHROpen = XMLHttpRequest.prototype.open;
    this.originalXHRSend = XMLHttpRequest.prototype.send;
  }

  public static getInstance(): NetworkTracker {
    if (!NetworkTracker.instance) {
      NetworkTracker.instance = new NetworkTracker();
    }
    return NetworkTracker.instance;
  }

  public initialize() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    // Override fetch
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const requestId = Math.random().toString(36).substring(2);

      // Extract URL from input
      let url = "";
      if (typeof args[0] === "string") {
        url = args[0];
      } else if (args[0] instanceof Request) {
        url = args[0].url;
      } else if (args[0] instanceof URL) {
        url = args[0].toString();
      }

      const method = args[1]?.method || "GET";

      this.requests.set(requestId, {
        id: requestId,
        startTime: Date.now(),
        url,
        method,
        completed: false,
      });

      this.notifyListeners();

      try {
        const response = await this.originalFetch.apply(window, args);
        this.completeRequest(requestId);
        return response;
      } catch (error) {
        this.completeRequest(requestId);
        throw error;
      }
    };

    // Override XMLHttpRequest
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null
    ) {
      this.__requestId = Math.random().toString(36).substring(2);
      this.__method = method;
      this.__url = url.toString();

      return NetworkTracker.instance.originalXHROpen.call(
        this,
        method,
        url,
        async,
        username,
        password
      );
    };

    XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      if (this.__requestId) {
        NetworkTracker.instance.requests.set(this.__requestId, {
          id: this.__requestId,
          startTime: Date.now(),
          url: this.__url || "",
          method: this.__method || "GET",
          completed: false,
        });

        NetworkTracker.instance.notifyListeners();

        this.addEventListener("loadend", () => {
          if (this.__requestId) {
            NetworkTracker.instance.completeRequest(this.__requestId);
          }
        });
      }

      return NetworkTracker.instance.originalXHRSend.call(this, body);
    };
  }

  private completeRequest(requestId: string) {
    const request = this.requests.get(requestId);
    if (request) {
      request.completed = true;
      request.endTime = Date.now();
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    const activeRequests = Array.from(this.requests.values());
    this.listeners.forEach((listener) => listener(activeRequests));
  }

  public subscribe(callback: (activeRequests: RequestInfo[]) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getActiveRequests(): RequestInfo[] {
    return Array.from(this.requests.values()).filter((req) => !req.completed);
  }

  public getPendingRequestCount(): number {
    return this.getActiveRequests().length;
  }

  public cleanup() {
    if (!this.initialized || typeof window === "undefined") return;

    // Restore original fetch to window.fetch
    window.fetch = this.originalFetch;
    XMLHttpRequest.prototype.open = this.originalXHROpen;
    XMLHttpRequest.prototype.send = this.originalXHRSend;

    this.requests.clear();
    this.listeners.clear();
    this.initialized = false;
  }
}

// Lazy-load the NetworkTracker only when needed
const getNetworkTracker = () => {
  if (typeof window === "undefined") return null;
  if (!networkTrackerInstance) {
    networkTrackerInstance = NetworkTracker.getInstance();
  }
  return networkTrackerInstance;
};

export default function NavigationProgress() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const [isChanging, setIsChanging] = useState(false);
  const [progress, setProgress] = useState(0);

  // Keep track of previous route
  const prevPathnameRef = useRef(pathname);
  const prevSearchParamsRef = useRef(searchParams);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const networkCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialRender = useRef(true);

  // Create a cache key from pathname and search params
  const currentKey = pathname + (searchParams?.toString() || "");
  const prevKey = prevPathnameRef.current + (prevSearchParamsRef.current?.toString() || "");

  // Memoized cleanup function to avoid recreation on each render
  const cleanupTimers = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (networkCheckTimerRef.current) clearInterval(networkCheckTimerRef.current);
  }, []);

  // Detect route changes
  useEffect(() => {
    // Skip effect on initial render to prevent affecting page load
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Navigation detected
    if (currentKey !== prevKey) {
      // Route change detected
      setIsChanging(true);
      setProgress(10);

      // Clear any existing timers
      cleanupTimers();

      // Gradually increase progress while navigation is happening
      progressTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          // Don't go over 80% until navigation completes
          if (prev < 80) return prev + 5;
          return prev;
        });
      }, 300);

      // Fallback timeout of 5 seconds in case navigation never "completes"
      resetTimerRef.current = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsChanging(false);
          setProgress(0);
          // Update refs after navigation is done
          prevPathnameRef.current = pathname;
          prevSearchParamsRef.current = searchParams;
        }, 200);

        cleanupTimers();
      }, 5000);

      // Lazy-load and initialize network tracker only during navigation
      const tracker = getNetworkTracker();
      if (tracker) tracker.initialize();

      // Create a timeout to check if all network requests are done
      networkCheckTimerRef.current = setInterval(() => {
        const tracker = getNetworkTracker();
        if (tracker && tracker.getPendingRequestCount() === 0) {
          // Network requests completed
          clearInterval(networkCheckTimerRef.current as NodeJS.Timeout);

          // Mark as complete
          setProgress(100);

          // Reset after animation completes
          setTimeout(() => {
            setIsChanging(false);
            setProgress(0);
            // Update refs after navigation is done
            prevPathnameRef.current = pathname;
            prevSearchParamsRef.current = searchParams;
          }, 200);

          // Clean up timers
          cleanupTimers();
        }
      }, 150); // Reduced frequency

      // Clean up on completion or when the effect runs again
      return () => {
        cleanupTimers();
      };
    }
  }, [pathname, searchParams, currentKey, prevKey, cleanupTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimers();
      const tracker = getNetworkTracker();
      if (tracker) tracker.cleanup();
    };
  }, [cleanupTimers]);

  // Only render the progress bar if we're actually changing routes
  if (!isChanging) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px]">
      <div
        className="h-full bg-gradient-to-r from-pri to-sec transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
