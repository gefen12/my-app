// src/TestSequence.js

import React from "react";
import SequenceQuestion from "./components/questions/SequenceQuestion"; // adjust path as needed

const sampleQuestion = {
  id: 23,
  type: "sequence",
  question: "סדר את הסד''פ לביצוע איפוס רטוב לפי הסדר הנכון:",
  steps: [
    "ירי של חמישה כדורים אל המטרה",
    "מציאת הנפ\"מ (נקודת פגיעה ממוצאת)",
    "בחר מטרה בין 200-500 מטר",
    "לחיצה על \"שמור תיקון חם\" ",
    "הזז בעזרת הלחצים במסך את הצלב אל הנפ\"מ ",
    "ירי של כדור בודד לוודא איפוס",
    "כניסה למסך \"לחימה משני\" - \"תיאום כוונות\" - \"איפוס חם\" "
  ],
  correctOrder: [6, 2, 0, 1, 4, 5, 3]
};

const TestSequence = () => {
  const handleNext = () => {
    alert("Next question triggered.");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <SequenceQuestion question={sampleQuestion} onNext={handleNext} />
    </div>
  );
};

export default TestSequence;
