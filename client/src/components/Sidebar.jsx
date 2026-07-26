import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
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
        { to: "/", label: "Dashboard", Icon: LayoutDashboard },
        { to: "/bill/new", label: "New Bill", Icon: PlusCircle },
      ]
    : [
        { to: "/dashboard", label: "My Bills", Icon: LayoutDashboard },
      ];

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="sidebar-brand-text">H-Bill</span>
            <button
              className="sidebar-collapse-btn"
              onClick={onToggleCollapse}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>
          <nav className="sidebar-nav">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`sidebar-link ${location.pathname === link.to ? "sidebar-link-active" : ""}`}
                title={collapsed ? link.label : undefined}
              >
                <link.Icon size={18} className="sidebar-link-icon" />
                <span className="sidebar-link-label">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-user" title={collapsed ? `${user?.name} (${user?.role})` : undefined}>
            <div className="sidebar-avatar">{user?.name?.charAt(0) || "?"}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-logout"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={18} className="sidebar-link-icon" />
            <span className="sidebar-link-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
