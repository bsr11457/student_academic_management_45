import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth({ mode, onLogin }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await api.post(endpoint, form);
      onLogin(data); navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server. Is the backend running?");
    } finally { setBusy(false); }
  }

  return <div className="auth-wrap">
    <section className="auth-info">
      <div className="eyebrow">STUDENT ACADEMIC MANAGEMENT</div>
      <h1>Your academics,<br /><span>all in one place.</span></h1>
      <p>Track student records, attendance, marks and assignments through one simple portal.</p>
      <div className="auth-points"><span>✓ Student records</span><span>✓ Attendance overview</span><span>✓ Academic progress</span></div>
    </section>
    <form className="panel auth-panel" onSubmit={submit}>
      <div className="eyebrow">{isRegister ? "GET STARTED" : "WELCOME BACK"}</div>
      <h2>{isRegister ? "Create account" : "Sign in"}</h2>
      <p className="muted">{isRegister ? "Create an account to access the portal." : "Enter your account details to continue."}</p>
      {isRegister && <label>Full name<input name="name" value={form.name} onChange={change} required placeholder="Your name" /></label>}
      <label>Email address<input name="email" type="email" value={form.email} onChange={change} required placeholder="you@example.com" /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={change} minLength="6" required placeholder="At least 6 characters" /></label>
      {isRegister && <label>Account role<select name="role" value={form.role} onChange={change}><option value="student">Student</option><option value="faculty">Faculty (demo)</option></select><small>For this classroom demo, role selection is open. Restrict faculty registration in a real deployment.</small></label>}
      {error && <p className="error">{error}</p>}
      <button className="button full" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}</button>
      <p className="auth-switch">{isRegister ? "Already registered?" : "New to CampusTrack?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
    </form>
  </div>;
}
