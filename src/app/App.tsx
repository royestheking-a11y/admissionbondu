import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { AuthProvider } from "./context/AuthContext";
import { loadGoogleIdentityScript } from "./lib/google";

export default function App() {
  useEffect(() => {
    // Pre-load Google SDK for faster login/register button rendering
    void loadGoogleIdentityScript().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

