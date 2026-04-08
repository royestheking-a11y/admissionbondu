import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { AuthProvider } from "./context/AuthContext";
import { AdmissionAI } from "./components/AdmissionAI";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <AdmissionAI />
    </AuthProvider>
  );
}
