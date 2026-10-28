import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Attendance from "./pages/Attendance.jsx";
import Marks from "./pages/Marks.jsx";
import Assignments from "./pages/Assignments.jsx";

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const user = localStorage.getItem("sam_user");
      const token = localStorage.getItem("sam_token");
      return user && token ? { user: JSON.parse(user), token } : null;
    } catch { return null; }
  });

  function onLogin(data) {
    localStorage.setItem("sam_token", data.token);
    localStorage.setItem("sam_user", JSON.stringify(data.user));
    setSession({ user: data.user, token: data.token });
  }
  function onLogout() {
    localStorage.removeItem("sam_token");
    localStorage.removeItem("sam_user");
    setSession(null);
  }
  const page = component => <ProtectedRoute user={session?.user}>{<Layout user={session?.user} onLogout={onLogout}>{component}</Layout>}</ProtectedRoute>;

  return <Routes>
    <Route path="/login" element={session ? <Navigate to="/" /> : <Auth mode="login" onLogin={onLogin} />} />
    <Route path="/register" element={session ? <Navigate to="/" /> : <Auth mode="register" onLogin={onLogin} />} />
    <Route path="/" element={page(<Dashboard user={session?.user} />)} />
    <Route path="/students" element={page(<Students user={session?.user} />)} />
    <Route path="/attendance" element={page(<Attendance user={session?.user} />)} />
    <Route path="/marks" element={page(<Marks user={session?.user} />)} />
    <Route path="/assignments" element={page(<Assignments user={session?.user} />)} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
