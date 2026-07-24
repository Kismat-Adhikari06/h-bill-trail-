import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBills } from "../api/bills";

function DashboardPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBills()
      .then(setBills)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading bills...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>

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
                <td style={tdStyle}>{bill.id}</td>
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
