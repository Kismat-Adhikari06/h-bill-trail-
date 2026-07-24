import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ marginBottom: "8px" }}>H-Bill</h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          Welcome, {user?.name}
        </p>

        <div style={placeholder}>
          <p style={{ fontSize: "18px", color: "#333", margin: 0 }}>
            Your scanned H-Bill will be here!
          </p>
        </div>

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#f5f5f5",
};

const card = {
  background: "#fff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
};

const placeholder = {
  padding: "40px 20px",
  border: "2px dashed #ddd",
  borderRadius: "12px",
  marginBottom: "24px",
  color: "#999",
};

const logoutBtn = {
  padding: "10px 24px",
  background: "#fff",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
};

export default UserPage;
