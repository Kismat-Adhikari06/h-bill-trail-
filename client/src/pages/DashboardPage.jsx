import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchBills } from "../api/bills";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills()
      .then(setBills)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) return <p>Loading bills...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
            Welcome, {user?.name}
          </p>
        </div>
        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </div>

      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Table</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td style={tdStyle}>{bill.id.slice(-6)}</td>
                <td style={tdStyle}>{bill.table_number}</td>
                <td style={tdStyle}>{bill.customer_name}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(bill.status)}>{bill.status}</span>
                </td>
                <td style={tdStyle}>Rs {bill.total_amount}</td>
                <td style={tdStyle}>
                  <Link to={`/qr/${bill.id}`} style={linkStyle}>
                    View QR
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "2px solid #ddd",
  background: "#f5f5f5",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const linkStyle = {
  color: "#0066cc",
  textDecoration: "none",
  fontWeight: "bold",
};

const logoutBtn = {
  padding: "8px 16px",
  background: "#fff",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
};

function statusStyle(status) {
  const colors = {
    open: "#2196f3",
    closed: "#ff9800",
    paid: "#4caf50",
  };
  return {
    padding: "4px 10px",
    borderRadius: "4px",
    color: "#fff",
    background: colors[status] || "#999",
    fontSize: "12px",
    fontWeight: "bold",
  };
}

export default DashboardPage;
