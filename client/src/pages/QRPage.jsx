import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBillQR } from "../api/bills";

function QRPage() {
  const { id } = useParams();
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBillQR(id)
      .then(setQr)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading QR code...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={containerStyle}>
      <h1>Bill #{qr.billId}</h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Table: {qr.tableNumber}
      </p>

      <div style={qrBoxStyle}>
        <img src={qr.qrImage} alt={`QR code for Bill ${qr.billId}`} style={{ width: "250px", height: "250px" }} />
      </div>

      <p style={{ marginTop: "20px", color: "#888", fontSize: "14px" }}>
        Scan this QR code to view the bill
      </p>

      <Link to="/" style={{ display: "inline-block", marginTop: "20px" }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}

const containerStyle = {
  textAlign: "center",
  padding: "40px 20px",
};

const qrBoxStyle = {
  display: "inline-block",
  padding: "20px",
  border: "2px solid #ddd",
  borderRadius: "12px",
  background: "#fff",
};

export default QRPage;
