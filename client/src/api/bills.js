const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchBills() {
  const response = await fetch(`${API_BASE}/bills`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch bills");
  }

  return json.data;
}

export async function fetchBillById(id) {
  const response = await fetch(`${API_BASE}/bills/${id}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch bill");
  }

  return json.data;
}

export async function fetchBillQR(id) {
  const response = await fetch(`${API_BASE}/qr/${id}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to generate QR");
  }

  return json.data;
}

export async function createBill(billData) {
  const response = await fetch(`${API_BASE}/bills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(billData),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to create bill");
  }

  return json.data;
}

export async function updateBill(id, billData) {
  const response = await fetch(`${API_BASE}/bills/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(billData),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to update bill");
  }

  return json.data;
}
