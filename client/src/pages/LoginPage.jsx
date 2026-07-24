import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, signup } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const saveBillId = searchParams.get("save");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let userData;
      if (isSignup) {
        userData = await signup(name, email, password);
      } else {
        userData = await login(email, password);
      }

      loginUser(userData);

      if (userData.role === "admin") {
        navigate("/");
      } else if (saveBillId) {
        navigate(`/dashboard?save=${saveBillId}`);
      } else {
        navigate("/dashboard");
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
          {isSignup ? "Create your account" : "Sign in to your account"}
        </p>

        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div style={field}>
              <label style={label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={input}
                required
              />
            </div>
          )}

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
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#666" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignup(!isSignup); setError(null); }}
            style={toggleBtn}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
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

const toggleBtn = {
  background: "none",
  border: "none",
  color: "#333",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
  textDecoration: "underline",
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
