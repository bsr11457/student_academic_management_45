import { useEffect, useState } from "react";
import api from "../api";

export default function Marks({ user }) {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ studentId: "", subject: "", internalMarks: 0, externalMarks: 0 });
  const faculty = user?.role === "faculty";
  async function load() {
    try {
      const [s, m] = await Promise.all([api.get("/students"), api.get("/marks")]);
      setStudents(s.data); setMarks(m.data); if (!form.studentId && s.data[0]) setForm(f => ({ ...f, studentId: s.data[0]._id }));
      setError("");
    } catch (e) { setError(e.response?.data?.message || "Could not load marks."); }
  }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault();
    try { await api.post("/marks", { ...form, internalMarks: Number(form.internalMarks), externalMarks: Number(form.externalMarks) }); setError(""); load(); }
    catch (e) { setError(e.response?.data?.message || "Could not save marks."); }
  }
  return <>
    <div className="page-title"><div><div className="eyebrow">ACADEMIC PERFORMANCE</div><h1>Marks & results</h1><p className="muted">Store and view subject-wise marks.</p></div></div>
    {faculty && <form className="panel form-panel" onSubmit={submit}><h2>Add marks</h2><div className="form-grid">
      <label>Student<select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}><option value="">Select student</option>{students.map(s => <option key={s._id} value={s._id}>{s.rollNumber} — {s.name}</option>)}</select></label>
      <label>Subject<input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject name" /></label>
      <label>Internal marks (0–100)<input required type="number" min="0" max="100" value={form.internalMarks} onChange={e => setForm({ ...form, internalMarks: e.target.value })} /></label>
      <label>External marks (0–100)<input required type="number" min="0" max="100" value={form.externalMarks} onChange={e => setForm({ ...form, externalMarks: e.target.value })} /></label>
    </div><button className="button" disabled={!students.length}>Save marks</button></form>}
    <div className="panel"><h2>Results</h2>{error && <p className="error">{error}</p>}<div className="table-scroll"><table><thead><tr><th>Student</th><th>Subject</th><th>Internal</th><th>External</th><th>Total</th></tr></thead><tbody>
      {marks.map(m => <tr key={m._id}><td>{m.studentId?.name || "Student removed"}<small>{m.studentId?.rollNumber}</small></td><td>{m.subject}</td><td>{m.internalMarks}</td><td>{m.externalMarks}</td><td><strong>{Number(m.internalMarks) + Number(m.externalMarks)}</strong></td></tr>)}
      {!marks.length && <tr><td colSpan="5" className="empty">No marks have been entered yet.</td></tr>}
    </tbody></table></div></div>
  </>;
}
