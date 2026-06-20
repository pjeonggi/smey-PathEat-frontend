import "maplibre-gl/dist/maplibre-gl.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "../shared/hooks/useAuth";
import { ThemeProvider } from "../shared/hooks/useTheme";
import { UserRoutes } from "../user/routes/userRoutes";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Navigate to="/user" replace />} />
            {UserRoutes()}
            <Route path="*" element={<Navigate to="/user" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
