import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/Auth/AuthContext";
import { GlobalProvider } from "./context/Global/GlobalContext";
import AppRoutes from "./routes/AppRoutes";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import TeamInvite from "./pages/TeamInvite";
import PublicRoute from "./routes/PublicRoute"
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

        <Route path="/" element={<LandingPage />} />
        <Route path="/team/invite/:token" element={<TeamInvite />} />
        <Route
          path="/*"
          element={
            <GlobalProvider>
              <AppRoutes />
            </GlobalProvider>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
