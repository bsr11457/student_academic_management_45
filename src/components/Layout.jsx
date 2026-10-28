import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Layout({ user, onLogout, children }) {
  const navigate = useNavigate();
  function logout() { onLogout(); navigate("/login"); }
  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/">Campus<span>Track</span></Link>
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/attendance">Attendance</NavLink>
        <NavLink to="/marks">Marks</NavLink>
        <NavLink to="/assignments">Assignments</NavLink>
      </nav>
      <div className="user-area"><span>{user?.name} · {user?.role}</span><button className="button small secondary" onClick={logout}>Log out</button></div>
    </header>
    <main className="page">{children}</main>
    <footer>CampusTrack · Student Academic Management System</footer>
  </div>;
}
