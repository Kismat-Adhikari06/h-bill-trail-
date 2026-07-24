import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      loginUser(user);

      if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>H-Bill</h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "24px" }}>
          Sign in to your account
        </p>

        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={field}>
            <label style={label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={input}
              required
            />
          </div>

          <div style={field}>
            <label style={label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={input}
              required
            />
          </div>

          <button type="submit" style={button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
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
};

const field = { marginBottom: "16px" };

const label = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
};

const input = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "8px",
};

const errorStyle = {
  background: "#fee",
  color: "#c00",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "14px",
  marginBottom: "16px",
  textAlign: "center",
};

export default LoginPage;
