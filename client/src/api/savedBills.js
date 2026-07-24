const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function saveBill(userId, billId) {
  const response = await fetch(`${API_BASE}/saved-bills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, bill_id: billId }),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to save bill");
  }

  return json.data;
}

export async function getSavedBills(userId) {
  const response = await fetch(`${API_BASE}/saved-bills/${userId}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch saved bills");
  }

  return json.data;
}

export async function checkBillSaved(userId, billId) {
  const response = await fetch(`${API_BASE}/saved-bills/check/${userId}/${billId}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to check bill");
  }

  return json.data;
}

export async function unsaveBill(userId, billId) {
  const response = await fetch(`${API_BASE}/saved-bills`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, bill_id: billId }),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to remove bill");
  }

  return json.data;
}
