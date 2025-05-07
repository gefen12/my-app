// src/TestSequence.js

import React from "react";
import FillInTheBlankQuestion from "./components/questions/FillInTheBlankQuestion"; // adjust path as needed

const sampleQuestion = {
    "id": 24,
    "type": "fill-in-the-blank",
    "question": "השלם: כיצד נתפעל תקלת \"סחיפה\"?",
    "blocks": [
        {
          "text": "נוריד מתג _ , נעבור למסך _ ונלחץ על לחיץ _ .",
          "correctWords": ["אפס סחיפות","לחימה משני", "אפשור תנועה"]
        }
      ],
    "options": ["אפס סחיפות","לחימה משני", "אפשור תנועה"]
};

const TestFillInTheBlank = () => {
  const handleNext = () => {
    alert("Next question triggered.");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <FillInTheBlankQuestion question={sampleQuestion} onNext={handleNext} />
    </div>
  );
};

export default TestFillInTheBlank;
