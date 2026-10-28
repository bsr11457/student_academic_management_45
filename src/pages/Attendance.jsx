import { useEffect, useState } from "react";
import api from "../api";

export default function Attendance({ user }) {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ studentId: "", subject: "", date: new Date().toISOString().slice(0,10), status: "Present" });
  const faculty = user?.role === "faculty";
  async function load() {
    try {
      const [s, a] = await Promise.all([api.get("/students"), api.get("/attendance")]);
      setStudents(s.data); setRecords(a.data); if (!form.studentId && s.data[0]) setForm(f => ({ ...f, studentId: s.data[0]._id }));
      setError("");
    } catch (e) { setError(e.response?.data?.message || "Could not load attendance."); }
  }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault();
    try { await api.post("/attendance", form); setError(""); load(); }
    catch (e) { setError(e.response?.data?.message || "Could not save attendance."); }
  }
  const present = records.filter(r => r.status === "Present").length;
  const percent = records.length ? Math.round(present / records.length * 100) : 0;
  return <>
    <div className="page-title"><div><div className="eyebrow">CLASSROOM TRACKING</div><h1>Attendance</h1><p className="muted">Record and review attendance entries.</p></div></div>
    <div className="stats-grid"><div className="stat-card"><span>Total entries</span><strong>{records.length}</strong></div><div className="stat-card"><span>Present entries</span><strong>{present}</strong></div><div className="stat-card"><span>Overall present rate</span><strong>{percent}%</strong></div></div>
    {faculty && <form className="panel form-panel" onSubmit={submit}><h2>Record attendance</h2>
      <div className="form-grid">
        <label>Student<select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}><option value="">Select student</option>{students.map(s => <option key={s._id} value={s._id}>{s.rollNumber} — {s.name}</option>)}</select></label>
        <label>Subject<input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Full Stack Development-II" /></label>
        <label>Date<input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
        <label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Present</option><option>Absent</option></select></label>
      </div><button className="button" disabled={!students.length}>Save attendance</button>
    </form>}
    <div className="panel"><h2>Recent attendance</h2>{error && <p className="error">{error}</p>}
      <div className="table-scroll"><table><thead><tr><th>Student</th><th>Subject</th><th>Date</th><th>Status</th></tr></thead><tbody>
        {records.map(r => <tr key={r._id}><td>{r.studentId?.name || "Student removed"} <small>{r.studentId?.rollNumber}</small></td><td>{r.subject}</td><td>{new Date(r.date).toLocaleDateString()}</td><td><span className={`status ${r.status === "Present" ? "good" : "bad"}`}>{r.status}</span></td></tr>)}
        {!records.length && <tr><td colSpan="4" className="empty">No attendance entries yet.</td></tr>}
      </tbody></table></div>
    </div>
  </>;
}
