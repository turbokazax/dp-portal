// src/components/Admin.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

// Component for each applicant item
const ApplicantItem = ({ applicant }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <li
      style={{
        marginBottom: "1rem",
        listStyle: "none",
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "4px",
        background: "black",
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}
      >
        {applicant.fullName} ({applicant.email || "No Email"})
      </div>
      {expanded && (
        <div style={{ marginTop: "0.5rem", textAlign: "left" }}>
          <p><strong>Age:</strong> {applicant.age}</p>
          <p><strong>School:</strong> {applicant.school}</p>
          <p><strong>Contact:</strong> {applicant.contact}</p>
          <p><strong>Relationship:</strong> {applicant.relationship}</p>
          <p><strong>Alcohol:</strong> {applicant.alcohol}</p>
          <p><strong>Sex:</strong> {applicant.sex}</p>
          <p><strong>Essay 1:</strong><br /> {applicant.essays?.essay1}</p>
          <p><strong>Essay 2:</strong><br /> {applicant.essays?.essay2}</p>
          <p><strong>Additional Information:</strong><br /> {applicant.additionalInfo}</p>
        </div>
      )}
    </li>
  );
};

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("Current UID:", uid);
        const profileRef = ref(db, `users/${uid}/profile`);
        onValue(profileRef, (snapshot) => {
          const data = snapshot.val();
          console.log("Admin check data:", data);
          if (data && data.isAdmin === true) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            navigate("/");
          }
          setLoading(false);
        });
      } else {
        console.log("No user logged in");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      const usersRef = ref(db, "users");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const nonAdminApplicants = [];
        for (const key in data) {
          if (data[key].profile && data[key].profile.isAdmin !== true) {
            nonAdminApplicants.push({
              uid: key,
              ...data[key].profile,
            });
          }
        }
        setApplicants(nonAdminApplicants);
      });
    }
  }, [isAdmin]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Admin Panel</h2>
      <h3>Applicants</h3>
      {applicants.length ? (
        <ul style={{ padding: 0 }}>
          {applicants.map((applicant) => (
            <ApplicantItem key={applicant.uid} applicant={applicant} />
          ))}
        </ul>
      ) : (
        <p>No applicants found.</p>
      )}
    </div>
  );
};

export default Admin;
