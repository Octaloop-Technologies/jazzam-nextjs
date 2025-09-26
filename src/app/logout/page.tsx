import { logoutAndRedirect } from "./action";

export default async function LogoutPage() {
  // This will execute on the server and redirect immediately
  await logoutAndRedirect();

  // This return will never be reached due to the redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}
