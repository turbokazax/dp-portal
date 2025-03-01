// src/components/Dashboard.jsx
import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import ApplicationInfo from "./ApplicationInfo";
import Decision from "./Decision";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  // The header takes 25% of the viewport height and spans 100% width
  // Since we don't set "fixed" or "sticky," it scrolls off as you move down
  const headerStyle = {
    width: "100%",
    height: "25vh",
    backgroundImage: `url("/diddyparty.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative", // or just omit "position" for default static
  };

  const signOutButtonStyle = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  };

  const titleContainerStyle = {
    marginTop: "1rem",
    textAlign: "center",
  };

  const titleStyle = {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 400,
    fontSize: "2rem",
    color: "#fff",
    margin: 0,
  };

  const mainContentStyle = {
    padding: "1rem",
  };

  const navStyle = {
    marginBottom: "1rem",
    textAlign: "center",
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* Header Section */}
      <header style={headerStyle}>
        <button style={signOutButtonStyle} onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      {/* Title below the header */}
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>Application Dashboard</h1>
      </div>

      {/* Main Content (Navigation + Routes) */}
      <div style={mainContentStyle}>
        <nav style={navStyle}>
          <Link to="/dashboard/application" style={{ marginRight: "1rem" }}>
            Application Information
          </Link>
          <Link to="/dashboard/decision">Decision</Link>
        </nav>
        <Routes>
          <Route path="application" element={<ApplicationInfo />} />
          <Route path="decision" element={<Decision />} />
          <Route path="*" element={<p>Please select a folder above.</p>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
