// /**
//  * Global API Interceptor
//  * Handles 401 errors and token expiry globally
//  */

// import { logout } from "@/redux/slices/authSlice";
// import { store } from "@/redux/store";
// import { logoutUserAction } from "@/lib/api/settings";

// const logoutUser = async (): Promise<void> => {
//   if (typeof window === "undefined") return;

//   try {
//     // Clear Redux state first for immediate UI feedback
//     store.dispatch(logout());

//     // Call server logout action
//     await logoutUserAction();
//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// };

// // Store original fetch
// const originalFetch = global.fetch;

// // Override global fetch
// global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
//   // Only intercept API calls to our backend
//   const url = typeof input === "string" ? input : input.toString();
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

//   if (url.includes(baseUrl || "") || url.startsWith("/api/")) {
//     // Skip authentication check for public form endpoints
//     if (url.includes("/forms/") && !url.includes("/forms/platform")) {
//       // This is a public form endpoint, skip authentication
//       return originalFetch(input, init);
//     }

//     const response = await originalFetch(input, init);

//     // If 401, handle token expiry
//     // if (response.status === 401) {
//     //   logoutUser();
//     // }

//     return response;
//   }

//   // For other URLs, use original fetch
//   return originalFetch(input, init);
// };
