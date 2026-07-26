import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBillById, updateBill } from "../api/bills";

function EditBillPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetchBillById(id)
      .then((bill) => {
        setForm({
          table_number: bill.table_number,
          customer_name: bill.customer_name,
          restaurant_name: bill.restaurant_name,
          status: bill.status,
          items: bill.items.map((item) => ({
            item_name: item.item_name,
            quantity: String(item.quantity),
            unit_price: String(item.unit_price),
          })),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleItemChange(index, field, value) {
    const updated = [...form.items];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  }

  function addItem() {
    setForm({
      ...form,
      items: [...form.items, { item_name: "", quantity: "", unit_price: "" }],
    });
  }

  function removeItem(index) {
    if (form.items.length <= 1) return;
    const updated = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updated });
  }

  function calculateTotal() {
    return form.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      return sum + qty * price;
    }, 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const billData = {
        ...form,
        table_number: form.table_number.toUpperCase(),
        items: form.items.map((item) => ({
          item_name: item.item_name,
          quantity: parseInt(item.quantity) || 0,
          unit_price: parseFloat(item.unit_price) || 0,
        })),
      };

      await updateBill(id, billData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading bill...</p>;

  if (!form) {
    return (
      <div>
        <p style={{ color: "red" }}>{error || "Bill not found."}</p>
        <button onClick={() => navigate("/")} style={backBtn}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>Edit Bill</h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
          Bill ID: {id.slice(-6)} &middot; Table {form.table_number}
        </p>
        <button onClick={() => navigate("/")} style={backBtn}>Back to Dashboard</button>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={formGrid}>
          <div style={formGroup}>
            <label style={label}>Table Number</label>
            <input
              type="text"
              name="table_number"
              value={form.table_number}
              onChange={handleChange}
              required
              style={input}
            />
          </div>
          <div style={formGroup}>
            <label style={label}>Customer Name</label>
            <input
              type="text"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              required
              style={input}
            />
          </div>
          <div style={formGroup}>
            <label style={label}>Restaurant Name</label>
            <input
              type="text"
              name="restaurant_name"
              value={form.restaurant_name}
              onChange={handleChange}
              style={input}
            />
          </div>
          <div style={formGroup}>
            <label style={label}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={input}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ margin: 0 }}>Bill Items</h3>
            {form.status === "open" && (
              <button type="button" onClick={addItem} style={addBtn}>+ Add Item</button>
            )}
          </div>

          <div className="item-header" style={itemHeader}>
            <span style={{ flex: 2 }}>Item Name</span>
            <span style={{ flex: 1 }}>Qty</span>
            <span style={{ flex: 1 }}>Unit Price (Rs)</span>
            <span style={{ minWidth: "80px" }}>Total</span>
            <span style={{ width: "30px" }}></span>
          </div>

          {form.items.map((item, index) => (
            <div key={index} className="item-row" style={itemRow}>
              <input
                type="text"
                placeholder="e.g. Butter Chicken"
                value={item.item_name}
                onChange={(e) => handleItemChange(index, "item_name", e.target.value)}
                required
                readOnly={form.status !== "open"}
                style={{ ...input, flex: 2, ...(form.status !== "open" ? { background: "#f5f5f5", cursor: "default" } : {}) }}
              />
              <input
                type="number"
                placeholder="0"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                min="1"
                required
                readOnly={form.status !== "open"}
                style={{ ...input, flex: 1, ...(form.status !== "open" ? { background: "#f5f5f5", cursor: "default" } : {}) }}
              />
              <input
                type="number"
                placeholder="0.00"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                min="0"
                step="0.01"
                required
                readOnly={form.status !== "open"}
                style={{ ...input, flex: 1, ...(form.status !== "open" ? { background: "#f5f5f5", cursor: "default" } : {}) }}
              />
              <span style={itemTotal}>
                Rs {((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
              </span>
              {form.status === "open" && (
                <button type="button" onClick={() => removeItem(index)} style={removeBtn}>x</button>
              )}
            </div>
          ))}
        </div>

        <div style={summaryBox}>
          <div style={{ ...summaryRow, ...summaryTotal }}>
            <span>Total</span>
            <span>Rs {calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <button type="submit" disabled={saving} style={submitBtn}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
};

const label = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#666",
  marginBottom: "4px",
};

const input = {
  padding: "8px 12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
};

const itemHeader = {
  display: "flex",
  gap: "10px",
  marginBottom: "6px",
  fontSize: "11px",
  fontWeight: "bold",
  color: "#888",
  textTransform: "uppercase",
  padding: "0 2px",
};

const itemRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px",
  alignItems: "center",
};

const itemTotal = {
  minWidth: "80px",
  fontSize: "14px",
  fontWeight: "bold",
};

const addBtn = {
  padding: "6px 12px",
  background: "#2196f3",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};

const removeBtn = {
  padding: "4px 8px",
  background: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
};

const backBtn = {
  padding: "6px 12px",
  background: "#fff",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer",
  marginTop: "8px",
};

const summaryBox = {
  marginTop: "20px",
  padding: "15px",
  background: "#f9f9f9",
  borderRadius: "8px",
  border: "1px solid #eee",
  maxWidth: "300px",
  marginLeft: "auto",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 0",
  fontSize: "14px",
};

const summaryTotal = {
  fontWeight: "bold",
  fontSize: "16px",
};

const submitBtn = {
  marginTop: "20px",
  padding: "12px 24px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
};

const errorBox = {
  padding: "10px",
  background: "#ffebee",
  color: "#c62828",
  borderRadius: "6px",
  marginBottom: "15px",
  fontSize: "14px",
};

export default EditBillPage;
