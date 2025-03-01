// src/components/Register.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Pre-check for password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.5rem", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "0.5rem", width: "100%" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.75rem 1.5rem" }}>Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
