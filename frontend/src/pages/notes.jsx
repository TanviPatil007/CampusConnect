

// export default Notes;
import React, { useState, useEffect } from "react";
import "./notes.css";
import axios from "axios";

export default function notes() {
  const [step, setStep] = useState("year");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [data, setData] = useState({});
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get("https://campusconnect-1-fv53.onrender.com/api/notes")
      .then((res) => {
        const grouped = {};
        res.data.forEach((note) => {
          if (!grouped[note.yearOfStudy]) grouped[note.yearOfStudy] = {};
          if (!grouped[note.yearOfStudy][note.department])
            grouped[note.yearOfStudy][note.department] = {};
          if (!grouped[note.yearOfStudy][note.department][note.subject])
            grouped[note.yearOfStudy][note.department][note.subject] = [];
          grouped[note.yearOfStudy][note.department][note.subject].push(note);
        });
        setData(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setStep("dept");
  };

  const handleDeptClick = (dept) => {
    setSelectedDept(dept);
    setStep("subject");
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setNotes(data[selectedYear][selectedDept][subject]);
    setStep("notes");
  };

  const handleBack = () => {
    if (step === "notes") setStep("subject");
    else if (step === "subject") setStep("dept");
    else if (step === "dept") setStep("year");
  };

  return (
    <div className="notes-container">
      <h1>Notes</h1>
      {step !== "year" && (
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back
        </button>
      )}

      {step === "year" && (
        <div className="grid">
          {Object.keys(data).map((year) => (
            <div
              key={year}
              className="card"
              onClick={() => handleYearClick(year)}
            >
              {year}
            </div>
          ))}
        </div>
      )}

      {step === "dept" && (
        <div className="grid">
          {Object.keys(data[selectedYear] || {}).map((dept) => (
            <div
              key={dept}
              className="card"
              onClick={() => handleDeptClick(dept)}
            >
              {dept}
            </div>
          ))}
        </div>
      )}

      {step === "subject" && (
        <div className="grid">
          {Object.keys(data[selectedYear][selectedDept] || {}).map((subject) => (
            <div
              key={subject}
              className="card"
              onClick={() => handleSubjectClick(subject)}
            >
              {subject}
            </div>
          ))}
        </div>
      )}

      {step === "notes" && (
        <div className="notes-list">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="note-item">
                <p>{note.originalName}</p>
                <a
                  href={`http://localhost:5173${note.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View / Download
                </a>
              </div>
            ))
          ) : (
            <p>No notes found for this subject.</p>
          )}
        </div>
      )}
    </div>
  );
}
