// src/components/ApplicationInfo.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, set, onValue } from "firebase/database";

const ApplicationInfo = () => {
  // --- Styles (Adjust as you like) ---
  const formContainerStyle = {
    maxWidth: "600px", // limit form width
    margin: "0 auto",  // center horizontally
  };

  const formGroupStyle = {
    marginBottom: "1rem",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
  };

  const inputStyle = {
    width: "100%",     // fill the container's width
    padding: "0.5rem",
  };

  const textAreaStyle = {
    width: "100%",
    padding: "0.5rem",
    minHeight: "80px",
  };

  // Form state
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [essay1, setEssay1] = useState("");
  const [essay2, setEssay2] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [contact, setContact] = useState("");
  const [relationship, setRelationship] = useState("single");
  const [alcohol, setAlcohol] = useState(5);
  const [sex, setSex] = useState("male");
  const [otherSex, setOtherSex] = useState("");

  // Submission & error states
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Splash overlay state
  const [showSplash, setShowSplash] = useState(false);
  const [splashPhase, setSplashPhase] = useState("warning"); // "warning" or "thankYou"

  // Word count error states
  const [essay1Error, setEssay1Error] = useState("");
  const [essay2Error, setEssay2Error] = useState("");
  const [additionalInfoError, setAdditionalInfoError] = useState("");

  const uid = auth.currentUser ? auth.currentUser.uid : null;

  // Helper: count words in a string
  const countWords = (text) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  // Word count handlers
  const handleEssay1Change = (e) => {
    const value = e.target.value;
    if (countWords(value) > 250) {
      setEssay1Error("Essay 1 exceeds the 250-word limit.");
    } else {
      setEssay1Error("");
      setEssay1(value);
    }
  };

  const handleEssay2Change = (e) => {
    const value = e.target.value;
    if (countWords(value) > 250) {
      setEssay2Error("Essay 2 exceeds the 250-word limit.");
    } else {
      setEssay2Error("");
      setEssay2(value);
    }
  };

  const handleAdditionalInfoChange = (e) => {
    const value = e.target.value;
    if (countWords(value) > 350) {
      setAdditionalInfoError("Additional Information exceeds the 350-word limit.");
    } else {
      setAdditionalInfoError("");
      setAdditionalInfo(value);
    }
  };

  // Fetch existing profile data (if any) on mount
  useEffect(() => {
    if (uid) {
      const profileRef = ref(db, "users/" + uid + "/profile");
      onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFullName(data.fullName || "");
          setAge(data.age || "");
          setSchool(data.school || "");
          setEssay1(data.essays?.essay1 || "");
          setEssay2(data.essays?.essay2 || "");
          setAdditionalInfo(data.additionalInfo || "");
          setContact(data.contact || "");
          setRelationship(data.relationship || "single");
          setAlcohol(data.alcohol || 5);
          setSex(data.sex || "male");
          setOtherSex(data.otherSex || "");
          setSubmitted(data.submitted || false);
        }
      });
    }
  }, [uid]);

  // Function to perform the actual submission
  const submitApplication = () => {
    // Decide what to store for sex: if "other" is selected, store otherSex value.
    const sexValue = sex === "other" ? otherSex : sex;
    set(ref(db, "users/" + uid + "/profile"), {
      fullName,
      age,
      school,
      essays: {
        essay1,
        essay2,
      },
      additionalInfo,
      contact,
      relationship,
      alcohol,
      sex: sexValue,
      submitted: true,
    })
      .then(() => {
        setSplashPhase("thankYou");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  // Handle Save button click: validate form then show splash overlay
  const handleSaveClick = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!fullName || !age || !school || !essay1 || !essay2 || !contact) {
      setError("Please fill out all required fields before submitting.");
      return;
    }
    // Validate word count errors
    if (essay1Error || essay2Error || additionalInfoError) {
      setError("Please ensure your essays and additional info are within the word limits.");
      return;
    }
    // If sex is "other", require a non-empty specification
    if (sex === "other" && !otherSex.trim()) {
      setError("Please specify your sex if you choose 'Other'.");
      return;
    }
    setError("");
    setSplashPhase("warning"); // set phase to warning initially
    setShowSplash(true);
  };

  // When user clicks "Ok" on the splash overlay during the warning phase
  const handleSplashConfirm = () => {
    setSplashPhase("thankYou");
    submitApplication();
  };

  // When user clicks "Proceed" during thank-you phase, hide the splash
  const handleProceed = () => {
    setShowSplash(false);
    setSubmitted(true);
    // alert("Profile submitted successfully!");
  };

  if (!uid) return <p>Please log in to access your application.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Application Information</h3>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      {/* Container to control width */}
      <div style={formContainerStyle}>
        <form>
          {/* Full Name */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              What is your full name?
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={submitted}
              style={inputStyle}
            />
          </div>

          {/* Age */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              What is your age?
            </label>
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              disabled={submitted}
              style={inputStyle}
            />
          </div>

          {/* School */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Which school do you attend?
            </label>
            <input
              type="text"
              placeholder="Enter your school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
              disabled={submitted}
              style={inputStyle}
            />
          </div>

          {/* Contact Information */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              How can we contact you? (Instagram, Telegram, Phone)
            </label>
            <input
              type="text"
              placeholder="Enter your contact information"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              disabled={submitted}
              style={inputStyle}
            />
          </div>

          {/* Essay 1 */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <b>Essay 1:</b> Please explain why you wish to join our party, how you learned about us, and outline your plans and aspirations during your time with us. (250 words maximum)
            </label>
            <textarea
              placeholder="Your response here..."
              value={essay1}
              onChange={handleEssay1Change}
              required
              disabled={submitted}
              style={{ ...textAreaStyle, minHeight: "100px" }}
            />
            {essay1Error && (
              <div style={{ color: "red" }}>{essay1Error}</div>
            )}
          </div>

          {/* Essay 2 */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <b>Essay 2:</b> Dr. Gregory House once said, "There are three choices in this life: be good, get good, or give up." Reflect on this statement by sharing which of these paths best describes your approach to challenges and personal growth. Include specific examples from your life that illustrate how you navigate obstacles and make choices that define your character. (250 words maximum)
            </label>
            <textarea
              placeholder="Your response here..."
              value={essay2}
              onChange={handleEssay2Change}
              required
              disabled={submitted}
              style={{ ...textAreaStyle, minHeight: "100px" }}
            />
            {essay2Error && (
              <div style={{ color: "red" }}>{essay2Error}</div>
            )}
          </div>

          {/* Additional Information */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <b>Additional Information:</b> If you have any further details or comments you'd like the admissions committee to consider, please share them here. (350 words maximum)
            </label>
            <textarea
              placeholder="Your response here..."
              value={additionalInfo}
              onChange={handleAdditionalInfoChange}
              disabled={submitted}
              style={textAreaStyle}
            />
            {additionalInfoError && (
              <div style={{ color: "red" }}>{additionalInfoError}</div>
            )}
          </div>

          {/* Relationship Status */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Relationship Status:</label>
            <label>
              <input
                type="radio"
                name="relationship"
                value="single"
                checked={relationship === "single"}
                onChange={(e) => setRelationship(e.target.value)}
                disabled={submitted}
              />
              Single
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="relationship"
                value="engaged"
                checked={relationship === "engaged"}
                onChange={(e) => setRelationship(e.target.value)}
                disabled={submitted}
              />
              Engaged
            </label>
          </div>

          {/* Alcohol Consumption */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              How hard do you drink alcohol? (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={alcohol}
              onChange={(e) => setAlcohol(e.target.value)}
              disabled={submitted}
            />
            <span style={{ marginLeft: "1rem" }}>{alcohol}</span>
          </div>

          {/* Sex */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Sex:</label>
            <label>
              <input
                type="radio"
                name="sex"
                value="male"
                checked={sex === "male"}
                onChange={(e) => setSex(e.target.value)}
                disabled={submitted}
              />
              Male
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="sex"
                value="female"
                checked={sex === "female"}
                onChange={(e) => setSex(e.target.value)}
                disabled={submitted}
              />
              Female
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="sex"
                value="other"
                checked={sex === "other"}
                onChange={(e) => setSex(e.target.value)}
                disabled={submitted}
              />
              Other
            </label>
            {/* If "other" is selected, show a textbox to specify */}
            {sex === "other" && (
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Please specify"
                  value={otherSex}
                  onChange={(e) => setOtherSex(e.target.value)}
                  disabled={submitted}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Save button (only if not submitted) */}
          {!submitted && (
            <button
              type="button"
              onClick={handleSaveClick}
              style={{ padding: "0.75rem 1.5rem" }}
            >
              Submit Application
            </button>
          )}
        </form>
      </div>

      {/* Splash Overlay */}
      {showSplash && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
              maxWidth: "90%",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            {splashPhase === "warning" ? (
              <>
                <p style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>
                  S.T.O.P: Stop, Think, Observe, Proceed
                </p>
                <p style={{ color: "black", marginBottom: "1rem" }}>
                  This is your final chance to review your application before submitting.
                  If you're <b>SURE</b> everything is correct, click "Ok" to submit.
                </p>
                <button
                  onClick={handleSplashConfirm}
                  style={{
                    backgroundColor: "gray",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    marginTop: "1rem",
                  }}
                >
                  Ok
                </button>
                <button
                  onClick={() => setShowSplash(false)}
                  style={{ padding: "0.75rem 1.5rem", marginLeft: "1rem" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p style={{ color: "green", fontWeight: "bold", fontSize: "1.2rem" }}>
                  Thanks for applying!
                </p>
                <p style={{ color: "black", marginBottom: "1rem" }}>
                  Your application has been submitted.
                </p>
                <button
                  onClick={handleProceed}
                  style={{ padding: "0.75rem 1.5rem" }}
                >
                  Proceed
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationInfo;
