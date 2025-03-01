// src/components/Decision.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { ref, onValue } from "firebase/database";

const Decision = () => {
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const uid = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const profileRef = ref(db, `users/${uid}/profile`);
    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.submitted) {
        setSubmitted(true);
      }
      setLoading(false);
    });
  }, [uid]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!uid) {
    return (
      <div>
        <h3>Decision</h3>
        <p>Please log in to view your decision status.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Decision</h3>
      {submitted ? (
        <p>
          Thank you for your interest in applying to the Diddy Party 2!
          <br />
          Our admissions officers can’t wait to read your application.
          <br /><br />
          Decisions will be released in <b>mid-June</b>, prior to the Haileybury prom.
          <br />
          Check on this page regularly for updates.
        </p>
      ) : (
        <p>
          It looks like you haven't submitted your application yet.
          <br />
          Please complete and submit your application before checking back here
          for your decision.
          <br /><br />
          The deadline to submit your application is <b>June 1st</b>.
        </p>
      )}
    </div>
  );
};

export default Decision;
