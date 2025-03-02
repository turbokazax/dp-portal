// src/components/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Optionally, handle error messages here
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundImage: `url("/diddyparty.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* Dimmed Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 2,
        }}
      />

      {/* University Title: Absolutely positioned */}
      <div
        style={{
          position: "absolute",
          top: "20%", // adjust this value as needed
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          fontFamily: "'Playfair Display', serif",
          fontSize: "3rem",
          color: "#fff",
          textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
        }}
      >
        DiddyParty University
      </div>

      {/* Login Form Container */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "1rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#fff" }}>Login</h2>
        <form onSubmit={handleLogin} style={{ textAlign: "center" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "0.5rem",
              marginBottom: "1rem",
              width: "250px",
            }}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "0.5rem",
              marginBottom: "1rem",
              width: "250px",
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            Login
          </button>
        </form>
        <p style={{ color: "#fff" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
