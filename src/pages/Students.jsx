import { useEffect, useState } from "react";
import api from "../api";

export default function Students({ user }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", rollNumber: "", email: "", department: "CSE (AI&ML)", year: 3, section: "A" });
  const [editing, setEditing] = useState("");
  const faculty = user?.role === "faculty";

  async function load() {
    try { const { data } = await api.get("/students", { params: { search } }); setStudents(data); setError(""); }
    catch (e) { setError(e.response?.data?.message || "Could not load students."); }
  }
  useEffect(() => { load(); }, [search]);

  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      if (editing) await api.put(`/students/${editing}`, form);
      else await api.post("/students", form);
      setForm({ name: "", rollNumber: "", email: "", department: "CSE (AI&ML)", year: 3, section: "A" });
      setEditing(""); load();
    } catch (e) { setError(e.response?.data?.message || "Could not save student."); }
  }
  function edit(s) {
    setEditing(s._id);
    setForm({ name: s.name, rollNumber: s.rollNumber, email: s.email || "", department: s.department, year: s.year, section: s.section });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function remove(id) {
    if (!window.confirm("Delete this student record?")) return;
    try { await api.delete(`/students/${id}`); load(); }
    catch (e) { setError(e.response?.data?.message || "Could not delete student."); }
  }

  return <>
    <div className="page-title"><div><div className="eyebrow">DIRECTORY</div><h1>Student records</h1><p className="muted">Search and manage the student directory.</p></div><span className="count-pill">{students.length} records</span></div>
    {faculty && <form className="panel form-panel" onSubmit={submit}>
      <h2>{editing ? "Update student" : "Add a student"}</h2>
      <div className="form-grid">
        <label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>Roll number<input required value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Department<input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></label>
        <label>Year<input type="number" min="1" max="6" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} /></label>
        <label>Section<input value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} /></label>
      </div>
      <div className="actions"><button className="button">{editing ? "Save changes" : "Add student"}</button>{editing && <button type="button" className="button secondary" onClick={() => { setEditing(""); setForm({ name:"",rollNumber:"",email:"",department:"CSE (AI&ML)",year:3,section:"A" }); }}>Cancel</button>}</div>
    </form>}
    <div className="panel">
      <div className="table-toolbar"><h2>Directory</h2><input className="search" placeholder="Search name or roll number..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      {error && <p className="error">{error}</p>}
      <div className="table-scroll"><table><thead><tr><th>Name</th><th>Roll number</th><th>Department</th><th>Year / Section</th>{faculty && <th>Actions</th>}</tr></thead>
        <tbody>{students.map(s => <tr key={s._id}><td><strong>{s.name}</strong><small>{s.email}</small></td><td>{s.rollNumber}</td><td>{s.department}</td><td>{s.year} / {s.section}</td>{faculty && <td><button className="text-button" onClick={() => edit(s)}>Edit</button><button className="text-button danger-text" onClick={() => remove(s._id)}>Delete</button></td>}</tr>)}
        {!students.length && <tr><td colSpan={faculty ? 5 : 4} className="empty">No student records yet. {faculty ? "Add the first student using the form above." : ""}</td></tr>}</tbody>
      </table></div>
    </div>
  </>;
}
