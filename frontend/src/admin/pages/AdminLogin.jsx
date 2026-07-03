import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage("Please enter username and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        navigate("/dashboard");
        return;
      }

      setMessage(data.message || "Invalid admin details.");
    } catch {
      setMessage("Admin login failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <div className="admin-login-copy">
          <p>Admin panel</p>
          <h1>Admin Login</h1>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          {message && <div className="admin-login-message">{message}</div>}

          <label>
            Username
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <div className="admin-login-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Login"}
            </button>

            <button className="secondary-admin-action" type="button" onClick={clearForm}>
              Clear
            </button>
          </div>

          <Link className="admin-back-link" to="/">
            Back to store
          </Link>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
