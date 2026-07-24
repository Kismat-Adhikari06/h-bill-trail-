import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getSavedBills, saveBill } from "../api/savedBills";

function UserPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const saveBillId = searchParams.get("save");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function fetchBills() {
    if (user) {
      getSavedBills(user.id)
        .then(setBills)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    fetchBills();
  }, [user]);

  useEffect(() => {
    if (user && saveBillId) {
      setSaving(true);
      saveBill(user.id, saveBillId)
        .then(() => {
          setJustSaved(true);
          return getSavedBills(user.id);
        })
        .then(setBills)
        .catch(() => {})
        .finally(() => {
          setSaving(false);
          setSearchParams({}, { replace: true });
          setTimeout(() => setJustSaved(false), 3000);
        });
    }
  }, [user, saveBillId]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleCardClick() {
    setJustSaved(false);
  }

  return (
    <div style={container}>
      <div style={wrapper}>
        <div style={header}>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px" }}>H-Bill</h1>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
              Welcome, {user?.name}
            </p>
          </div>
          <button onClick={handleLogout} style={logoutBtn}>Logout</button>
        </div>

        {justSaved && (
          <div style={savedBanner}>
            Bill saved to your account!
          </div>
        )}

        {saving && (
          <p style={{ textAlign: "center", color: "#888" }}>Saving bill...</p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Loading bills...</p>
        ) : bills.length === 0 ? (
          <div style={empty}>
            <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>
              No saved bills yet.
            </p>
            <p style={{ fontSize: "14px", color: "#999", margin: "8px 0 0" }}>
              Scan a QR code to save a bill.
            </p>
          </div>
        ) : (
          <div style={grid}>
            {bills.map((item) => (
              <Link
                to={`/bill/${item.bill.id}`}
                key={item.saved_id}
                style={billCard}
                onClick={handleCardClick}
              >
                <div style={cardHeader}>
                  <span style={tableBadge}>Table {item.bill.table_number}</span>
                  <span style={statusBadge(item.bill.status)}>{item.bill.status}</span>
                </div>
                <p style={{ margin: "8px 0", fontSize: "13px", color: "#888" }}>
                  {item.bill.restaurant_name}
                </p>
                <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>
                  {item.bill.customer_name}
                </p>
                <div style={cardFooter}>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Rs {item.bill.total_amount}
                  </span>
                  <span style={{ fontSize: "12px", color: "#999" }}>
                    Bill #{item.bill.id.slice(-6)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function statusBadge(status) {
  const colors = {
    open: "#2196f3",
    closed: "#ff9800",
    paid: "#4caf50",
  };
  return {
    padding: "2px 8px",
    borderRadius: "4px",
    color: "#fff",
    background: colors[status] || "#999",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
  };
}

const container = {
  minHeight: "100vh",
  background: "#f5f5f5",
  padding: "20px",
};

const wrapper = {
  maxWidth: "700px",
  margin: "0 auto",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
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

const savedBanner = {
  background: "#e8f5e9",
  color: "#2e7d32",
  padding: "12px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "center",
  marginBottom: "16px",
};

const empty = {
  textAlign: "center",
  padding: "60px 20px",
  background: "#fff",
  borderRadius: "12px",
  border: "2px dashed #ddd",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "16px",
};

const billCard = {
  display: "block",
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  textDecoration: "none",
  color: "inherit",
  transition: "box-shadow 0.2s",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const tableBadge = {
  padding: "2px 8px",
  borderRadius: "4px",
  background: "#f0f0f0",
  fontSize: "12px",
  fontWeight: "600",
};

const cardFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "12px",
  paddingTop: "12px",
  borderTop: "1px solid #eee",
};

export default UserPage;
