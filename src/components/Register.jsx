// src/components/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
      const uid = auth.currentUser.uid;
      // Create a minimal profile for the user in the database with isAdmin false
      await set(ref(db, "users/" + uid + "/profile"), {
        email,
        isAdmin: false,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
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
      {/* University Title */}
      <div
        style={{
          position: "absolute",
          top: "20%", // adjust as needed
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
      {/* Centered Register Form */}
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
        <h2 style={{ marginBottom: "1rem", color: "#fff" }}>Register</h2>
        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}
        <form onSubmit={handleRegister} style={{ textAlign: "center" }}>
          <input
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
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
            Register
          </button>
        </form>
        <p style={{ color: "#fff" }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
