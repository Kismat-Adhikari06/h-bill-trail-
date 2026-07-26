import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdmin = user?.role === "admin";

  const links = isAdmin
    ? [
        { to: "/", label: "Dashboard", icon: "\u25A6" },
        { to: "/bill/new", label: "New Bill", icon: "+" },
      ]
    : [
        { to: "/dashboard", label: "My Bills", icon: "\u25A6" },
      ];

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">H-Bill</div>
          <nav className="sidebar-nav">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`sidebar-link ${location.pathname === link.to ? "sidebar-link-active" : ""}`}
              >
                <span className="sidebar-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.charAt(0) || "?"}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout">Logout</button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
