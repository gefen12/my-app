import React, { useState, useEffect } from "react";
import "./MultipleChoiceQuestion.css";
import ProgressBar from "../ProgressBar.jsx"; // Import the ProgressBar component

const MultipleChoiceQuestion = ({ question, onNext, onAnswer, current, total }) => {
  const correctAnswers = question.correctAnswers;
  const [selected, setSelected] = useState([]);
  const [checked, setChecked] = useState(false);

  // Reset state when the question changes
  useEffect(() => {
    setSelected([]);
    setChecked(false);
  }, [question]);

  const toggleSelection = (index) => {
    if (checked) return; // Disable clicks after checking

    let updated;
    if (selected.includes(index)) {
      updated = selected.filter((i) => i !== index);
    } else {
      updated = [...selected, index];
    }
    setSelected(updated);

    if (updated.length === correctAnswers.length) {
      setTimeout(() => {
        setChecked(true); // Check when selection complete
        checkAnswer(updated); // Evaluate the answer
      }, 300); // delay for better UX
    }
  };
  const checkAnswer = (selectedAnswers) => {
    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((index) => correctAnswers.includes(index));
    onAnswer(isCorrect); // Pass the result to the parent
  };

  const isCorrect = (index) =>
    correctAnswers.includes(index) && selected.includes(index);

  const isIncorrect = (index) =>
    !correctAnswers.includes(index) && selected.includes(index);

  return (
    <div className="quiz-container">
      <div className="question-text">
        <ProgressBar current={current} total={total} /> {/* Progress Bar */}
        {question.question}</div>
      <div className="options">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`option-button 
              ${selected.includes(index) ? "selected" : ""}
              ${checked && isCorrect(index) ? "correct" : ""}
              ${checked && isIncorrect(index) ? "incorrect" : ""}
            `}
            onClick={() => toggleSelection(index)}
          >
            {option}
          </div>
        ))}
      </div>

      {checked && (
         <div
         className="submit-button"
         onClick={() => {
           onNext(); // Move to the next question
         }}
       >
          המשך
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
