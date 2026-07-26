import { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchBills } from "../api/bills";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBill, setExpandedBill] = useState(null);
  const [dateFilter, setDateFilter] = useState("today");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills()
      .then(setBills)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function toggleExpand(billId) {
    setExpandedBill(expandedBill === billId ? null : billId);
  }

  if (loading) return <div style={loadingWrap}><div style={spinner} /></div>;
  if (error) return <div style={errorWrap}><p style={{ color: "#e53935" }}>Error: {error}</p></div>;

  function filterBills(bills, filter) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (filter) {
      case "today":
        return bills.filter((b) => new Date(b.created_at) >= startOfToday);
      case "yesterday":
        return bills.filter((b) => {
          const d = new Date(b.created_at);
          return d >= startOfYesterday && d < startOfToday;
        });
      case "week":
        return bills.filter((b) => new Date(b.created_at) >= startOfWeek);
      case "month":
        return bills.filter((b) => new Date(b.created_at) >= startOfMonth);
      case "year":
        return bills.filter((b) => new Date(b.created_at) >= startOfYear);
      default:
        return bills;
    }
  }

  const filteredBills = filterBills(bills, dateFilter);
  const totalRevenue = filteredBills.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const openBills = filteredBills.filter((b) => b.status === "open").length;
  const closedBills = filteredBills.filter((b) => b.status === "closed").length;
  const paidBills = filteredBills.filter((b) => b.status === "paid").length;

  const filters = [
    { key: "all", label: "All Time" },
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "year", label: "This Year" },
  ];

  return (
    <div style={pageWrap}>
      <div className="dash-header">
        <div>
          <h1 style={pageTitle}>Dashboard</h1>
          <p style={welcomeText}>Welcome back, <strong>{user?.name}</strong></p>
        </div>
        <div className="dash-header-actions">
          <button onClick={() => navigate("/bill/new")} style={createBtn}>+ New Bill</button>
        </div>
      </div>

      <div className="dash-stats">
        <div style={statCard}>
          <div style={statValue}>{filteredBills.length}</div>
          <div style={statLabel}>Total Bills</div>
        </div>
        <div style={statCard}>
          <div style={{ ...statValue, color: "#2196f3" }}>{openBills}</div>
          <div style={statLabel}>Open</div>
        </div>
        <div style={statCard}>
          <div style={{ ...statValue, color: "#ff9800" }}>{closedBills}</div>
          <div style={statLabel}>Closed</div>
        </div>
        <div style={statCard}>
          <div style={{ ...statValue, color: "#4caf50" }}>{paidBills}</div>
          <div style={statLabel}>Paid</div>
        </div>
        <div style={statCard}>
          <div style={{ ...statValue, color: "#333" }}>Rs {totalRevenue.toFixed(0)}</div>
          <div style={statLabel}>Revenue</div>
        </div>
      </div>

      <div className="dash-filters">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setDateFilter(f.key)}
            style={dateFilter === f.key ? filterBtnActive : filterBtn}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="dash-table-wrap">
        {filteredBills.length === 0 ? (
          <div style={emptyState}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>&#128203;</div>
            <p style={{ color: "#999", fontSize: "15px" }}>No bills found for this period</p>
          </div>
        ) : (
          <div className="dash-table-scroll">
            <table className="dash-table">
              <thead>
                <tr>
                  <th style={th}>Bill ID</th>
                  <th style={th}>Table</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Items</th>
                  <th style={th}>Total</th>
                  <th style={th}>Status</th>
                  <th style={th}>Created</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <Fragment key={bill.id}>
                    <tr>
                      <td style={td}><code style={billId}>{bill.id.slice(-6)}</code></td>
                      <td style={td}><span style={tableBadge}>{bill.table_number}</span></td>
                      <td style={td}><span style={customerName}>{bill.customer_name}</span></td>
                      <td style={td}>
                        <button onClick={() => toggleExpand(bill.id)} style={expandBtn}>
                          {expandedBill === bill.id ? "Hide" : "View"} ({bill.items?.length || 0})
                        </button>
                      </td>
                      <td style={td}><strong style={{ color: "#1a1a2e" }}>Rs {bill.total_amount}</strong></td>
                      <td style={td}><span style={statusPill(bill.status)}>{bill.status}</span></td>
                      <td style={td}><span style={dateText}>{new Date(bill.created_at).toLocaleString()}</span></td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          {bill.status === "open" && (
                            <Link to={`/bill/${bill.id}/edit`} style={editBtn}>Edit</Link>
                          )}
                          <Link to={`/qr/${bill.id}`} style={actionBtn}>QR</Link>
                          <Link to={`/bill/${bill.id}`} style={actionBtn}>View</Link>
                        </div>
                      </td>
                    </tr>
                    {expandedBill === bill.id && (
                      <tr>
                        <td colSpan={8} style={{ padding: "0 16px 14px" }}>
                          <div style={itemsPanel}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                              <thead>
                                <tr>
                                  <th style={itemTh}>Item</th>
                                  <th style={{ ...itemTh, textAlign: "center" }}>Qty</th>
                                  <th style={{ ...itemTh, textAlign: "right" }}>Price</th>
                                  <th style={{ ...itemTh, textAlign: "right" }}>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {bill.items?.map((item, idx) => (
                                  <tr key={idx}>
                                    <td style={itemTd}>{item.item_name}</td>
                                    <td style={{ ...itemTd, textAlign: "center" }}>{item.quantity}</td>
                                    <td style={{ ...itemTd, textAlign: "right" }}>Rs {item.unit_price}</td>
                                    <td style={{ ...itemTd, textAlign: "right", fontWeight: "600" }}>Rs {item.total_price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const pageWrap = { padding: "0" };

const pageTitle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "800",
  color: "#1a1a2e",
  letterSpacing: "-0.5px",
};

const welcomeText = {
  margin: "4px 0 0",
  color: "#888",
  fontSize: "14px",
};

const createBtn = {
  padding: "10px 20px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: "600",
};

const statCard = {
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  background: "#fff",
  border: "1px solid #eee",
};

const statIcon = {
  fontSize: "14px",
  opacity: 0.8,
  marginBottom: "6px",
};

const statValue = {
  fontSize: "28px",
  fontWeight: "800",
  lineHeight: "1.1",
};

const statLabel = {
  fontSize: "12px",
  opacity: 0.85,
  marginTop: "4px",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const filterBtn = {
  padding: "8px 16px",
  background: "transparent",
  color: "#888",
  border: "none",
  borderRadius: "8px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.15s",
};

const filterBtnActive = {
  padding: "8px 16px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "600",
};

const th = {
  textAlign: "left",
  padding: "14px 16px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  color: "#999",
  fontWeight: "700",
  background: "#fafafa",
};

const td = {
  padding: "14px 16px",
  borderBottom: "1px solid #f5f5f5",
  fontSize: "14px",
};

const billId = {
  fontFamily: "monospace",
  background: "#f0f0f5",
  padding: "3px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  color: "#555",
};

const tableBadge = {
  background: "#e3f2fd",
  color: "#1565c0",
  padding: "4px 10px",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "13px",
};

const customerName = {
  fontWeight: "600",
  color: "#1a1a2e",
};

const expandBtn = {
  background: "#f5f5f5",
  border: "none",
  color: "#555",
  padding: "5px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

const actionBtn = {
  color: "#333",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "12px",
  padding: "5px 10px",
  borderRadius: "6px",
  background: "#f5f5f5",
};

const editBtn = {
  color: "#fff",
  background: "#2196f3",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "12px",
  padding: "5px 12px",
  borderRadius: "6px",
};

const dateText = {
  color: "#999",
  fontSize: "13px",
};

const itemsPanel = {
  background: "#fafafa",
  borderRadius: "12px",
  padding: "14px",
  border: "1px solid #eee",
};

const itemTh = {
  textAlign: "left",
  padding: "8px 12px",
  borderBottom: "1px solid #e0e0e0",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#999",
  fontWeight: "700",
};

const itemTd = {
  padding: "8px 12px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "13px",
  color: "#444",
};

const emptyState = {
  padding: "60px 20px",
  textAlign: "center",
};

const loadingWrap = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "300px",
};

const spinner = {
  width: "36px",
  height: "36px",
  border: "3px solid #eee",
  borderTopColor: "#333",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const errorWrap = {
  padding: "40px",
  textAlign: "center",
};

function statusPill(status) {
  const colors = {
    open: { bg: "#e3f2fd", text: "#1565c0" },
    closed: { bg: "#fff3e0", text: "#e65100" },
    paid: { bg: "#e8f5e9", text: "#2e7d32" },
  };
  const c = colors[status] || { bg: "#f5f5f5", text: "#666" };
  return {
    padding: "4px 12px",
    borderRadius: "6px",
    color: c.text,
    background: c.bg,
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  };
}

export default DashboardPage;
