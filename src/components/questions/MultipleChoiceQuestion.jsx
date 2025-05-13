import React, { useState, useEffect } from "react";
import "./MultipleChoiceQuestion.css";

const MultipleChoiceQuestion = ({ question, onNext, onAnswer }) => {
  const correctAnswers = question.correctAnswers;
  const [selected, setSelected] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // Track if the answer is correct
  const [attempts, setAttempts] = useState(0); // Track the number of attempts
  const [showExplanation, setShowExplanation] = useState(false); // Show explanation after 2 incorrect attempts

  // Reset state when the question changes
  useEffect(() => {
    resetQuestion();
    setAttempts(0); 
  }, [question]);

  const toggleSelection = (index) => {
    if (checked || showExplanation) return; // Disable clicks after checking or if explanation is shown

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
        evaluateAnswer(updated); // Evaluate the answer
      }, 300); // delay for better UX
    }
  };

  const evaluateAnswer = (selectedAnswers) => {
    const isAnswerCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((index) => correctAnswers.includes(index));
    setIsCorrect(isAnswerCorrect);
    onAnswer(isAnswerCorrect); // Pass the result to the parent

    if (!isAnswerCorrect) {
      setAttempts((prev) => prev + 1); // Increment attempts if incorrect
      if (attempts >= 1) {
        setShowExplanation(true); // Show explanation after 2 incorrect attempts
      }
    }
  };

  const resetQuestion = () => {
    setSelected([]);
    setChecked(false);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const isOptionCorrect = (index) =>
    correctAnswers.includes(index) && selected.includes(index);

  const isOptionIncorrect = (index) =>
    !correctAnswers.includes(index) && selected.includes(index);

  return (
    <div className="quiz-container">
      {!showExplanation && (
        <>
          <div className="question-text">{question.question}</div>
          <div className="options">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option-button 
                  ${selected.includes(index) ? "selected" : ""}
                  ${checked && isOptionCorrect(index) ? "correct" : ""}
                  ${checked && isOptionIncorrect(index) ? "incorrect" : ""}
                `}
                onClick={() => toggleSelection(index)}
              >
                {option}
              </div>
            ))}
          </div>
        </>
      )}

      {checked && !showExplanation && (
        <div
          className="submit-button"
          onClick={() => {
            if (isCorrect) {
              setAttempts(0); // Reset attempts
              onNext(); // Move to the next question if correct
            } else {
              resetQuestion(); // Reset the question if incorrect
            }
          }}
        >
          {isCorrect ? "המשך" : "נסה שוב"}
        </div>
      )}

      {showExplanation && (
        <div className="explanation">
          <h3>הסבר:</h3>
          <p>{question.explanation}</p>
          <div
            className="submit-button"
            onClick={onNext}
          >
            המשך
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
