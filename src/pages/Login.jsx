import { useState } from "react";
import "./../styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Later connect to .NET API
    console.log({
      username,
      password,
    });

    alert("Login button clicked");
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="logo-section">
          <h1>SEJAYA</h1>
          <p>Micro Credit Ltd</p>
        </div>

        <h2>Sanctions Screening System</h2>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <div className="footer-text">
          © 2026 SEJAYA Micro Credit Ltd
        </div>

      </div>

    </div>
  );
}