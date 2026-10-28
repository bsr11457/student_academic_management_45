import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  const cards = [
    { title: "Student records", description: "Add, search and maintain student details.", to: "/students", icon: "01" },
    { title: "Attendance", description: "Record attendance and calculate percentages.", to: "/attendance", icon: "02" },
    { title: "Marks & results", description: "Store internal and external marks.", to: "/marks", icon: "03" },
    { title: "Assignments", description: "See upcoming work and due dates.", to: "/assignments", icon: "04" }
  ];
  return <>
    <div className="hero">
      <div><div className="eyebrow">ACADEMIC OVERVIEW</div><h1>Good to see you, {user?.name?.split(" ")[0]}.</h1><p>Everything you need to keep academics organised.</p></div>
      <div className="hero-mark">CT</div>
    </div>
    <div className="section-heading"><div><h2>Your workspace</h2><p className="muted">Choose a module to get started.</p></div><span className="role-pill">{user?.role} account</span></div>
    <div className="feature-grid">{cards.map((card) => <Link to={card.to} className="feature-card" key={card.to}>
      <span className="card-number">{card.icon}</span><h3>{card.title}</h3><p>{card.description}</p><span className="card-link">Open module ↗</span>
    </Link>)}</div>
    <div className="note"><strong>Quick note</strong><p>{user?.role === "faculty" ? "You can add and maintain records in the modules. Use a unique roll number for every student." : "You can view the academic records. Faculty-only actions are disabled for student accounts."}</p></div>
  </>;
}
