import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBillById } from "../api/bills";
import { useAuth } from "../context/AuthContext";

function BillPage() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBillById(id)
      .then(setBill)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!user) {
      navigate(`/login?save=${id}`);
      return;
    }

    navigate(`/dashboard?save=${id}`);
  }

  if (loading) return <p style={center}>Loading bill...</p>;
  if (error) return <p style={{ ...center, color: "red" }}>Error: {error}</p>;
  if (!bill) return <p style={center}>Bill not found.</p>;

  const date = new Date(bill.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "22px" }}>{bill.restaurant_name}</h1>
        <p style={{ margin: "4px 0 0", color: "#666", fontSize: "14px" }}>
          Bill #{bill.id} &middot; Table {bill.table_number}
        </p>
        <p style={{ margin: "2px 0 0", color: "#888", fontSize: "13px" }}>
          {date}
        </p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={thStyle}>Item</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Qty</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Price</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.item_name}</td>
              <td style={{ ...tdStyle, textAlign: "center" }}>{item.quantity}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>Rs {item.unit_price}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>Rs {item.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={summaryStyle}>
        <div style={rowStyle}>
          <span>Subtotal</span>
          <span>Rs {bill.subtotal}</span>
        </div>
        <div style={rowStyle}>
          <span>VAT ({bill.vat_rate}%)</span>
          <span>Rs {bill.vat_amount}</span>
        </div>
        <div style={{ ...rowStyle, ...totalRowStyle }}>
          <span>Total</span>
          <span>Rs {bill.total_amount}</span>
        </div>
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button onClick={handleSave} style={saveBtn}>
          Save Bill
        </button>
      </div>
    </div>
  );
}

const center = { textAlign: "center", padding: "40px" };

const containerStyle = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "system-ui, sans-serif",
  background: "#fff",
  minHeight: "100vh",
};

const headerStyle = {
  textAlign: "center",
  paddingBottom: "16px",
  borderBottom: "1px dashed #ddd",
};

const thStyle = {
  textAlign: "left",
  padding: "8px 4px",
  borderBottom: "2px solid #333",
  fontSize: "13px",
  textTransform: "uppercase",
  color: "#555",
};

const tdStyle = {
  padding: "10px 4px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

const summaryStyle = {
  marginTop: "16px",
  borderTop: "1px dashed #ddd",
  paddingTop: "12px",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  fontSize: "14px",
};

const totalRowStyle = {
  borderTop: "2px solid #333",
  marginTop: "8px",
  paddingTop: "10px",
  fontWeight: "bold",
  fontSize: "18px",
};

const saveBtn = {
  padding: "12px 32px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

export default BillPage;
