import { useEffect, useState } from "react";
import api from "../api";

export default function Assignments({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", subject: "", description: "", dueDate: "" });
  const faculty = user?.role === "faculty";
  async function load() {
    try { const { data } = await api.get("/assignments"); setAssignments(data); setError(""); }
    catch (e) { setError(e.response?.data?.message || "Could not load assignments."); }
  }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault();
    try { await api.post("/assignments", form); setForm({ title:"", subject:"", description:"", dueDate:"" }); load(); }
    catch (e) { setError(e.response?.data?.message || "Could not create assignment."); }
  }
  return <>
    <div className="page-title"><div><div className="eyebrow">COURSEWORK</div><h1>Assignments</h1><p className="muted">Keep track of tasks and upcoming deadlines.</p></div><span className="count-pill">{assignments.length} assignments</span></div>
    {faculty && <form className="panel form-panel" onSubmit={submit}><h2>Create assignment</h2><div className="form-grid">
      <label>Title<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
      <label>Subject<input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></label>
      <label>Due date<input required type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></label>
      <label className="wide">Description<textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
    </div><button className="button">Publish assignment</button></form>}
    {error && <p className="error">{error}</p>}
    <div className="assignment-grid">{assignments.map(a => <article className="assignment-card" key={a._id}>
      <div className="assignment-top"><span className="subject-tag">{a.subject}</span><span className="due-tag">Due {new Date(a.dueDate).toLocaleDateString()}</span></div>
      <h3>{a.title}</h3><p>{a.description || "No additional instructions provided."}</p><div className="assignment-by">Created by {a.createdBy?.name || "Faculty"}</div>
    </article>)}
    {!assignments.length && <div className="panel empty">No assignments yet. {faculty ? "Create the first assignment above." : "Check back later."}</div>}</div>
  </>;
}
