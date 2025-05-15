import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";
import "./SequenceQuestion.css";
import ProgressBar from "../ProgressBar.jsx"; // Import the ProgressBar component

const SequenceQuestion = ({ question, onNext, onAnswer, current, total }) => {
  const [currentOrder, setCurrentOrder] = useState(
    question.steps.map((_, i) => i)
  );
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0); // Track the number of attempts
  const [showExplanation, setShowExplanation] = useState(false); // Show explanation after 2 incorrect attempts
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // Track if the answer is correct

  // Reset currentOrder whenever the question changes
  useEffect(() => {
    resetQuestion();
    setAttempts(0); // Reset attempts when question changes
  }, [question]);

  const handleDragEnd = (result) => {
    if (!result.destination || checked) return;

    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);
    setCurrentOrder(newOrder);
  };

  const handleSubmit = () => {
    setChecked(true);

    // Check if the current order matches the correct order
    const isCorrect = currentOrder.every(
      (stepIndex, index) => stepIndex === question.correctOrder[index]
    );

    setIsAnswerCorrect(isCorrect); // Track if the answer is correct

    if (isCorrect) {
      onAnswer(true); // Pass the result to the parent
    } else {
      const newAttempts = attempts + 1; // Increment attempts
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        setShowExplanation(true); // Show explanation after 2 incorrect attempts
      }
    }
  };

  const resetQuestion = () => {
    setCurrentOrder(question.steps.map((_, i) => i)); // Reset the order
    setChecked(false); // Reset the checked state
    setIsAnswerCorrect(null); // Reset the answer correctness
    setShowExplanation(false); // Reset explanation visibility
  };

  const isCorrect = (index) =>
    currentOrder[index] === question.correctOrder[index];

  return (
    <div className="question-card">
      {!showExplanation && (
        <>
          <div className="question-text">
            <ProgressBar current={current} total={total} />
            {question.question}
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  className="steps"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {currentOrder.map((stepIndex, index) => (
                    <Draggable
                      key={stepIndex}
                      draggableId={`step-${stepIndex}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`step-box
                            ${checked && isCorrect(index) ? "correct" : ""}
                            ${checked && !isCorrect(index) ? "incorrect" : ""}
                            ${snapshot.isDragging ? "dragging" : ""}
                          `}
                        >
                          <span className="step-text">
                            {question.steps[stepIndex]}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
      {!checked && !showExplanation && (
        <div className="submit-button" onClick={handleSubmit}>
          בדוק
        </div>
      )}

      {checked && !showExplanation && !isAnswerCorrect && attempts < 2 && (
        <div
          className="submit-button"
          onClick={resetQuestion}
        >
          נסה שוב
        </div>
      )}

      {showExplanation && (
        <div className="explanation">
          <h3>הסבר:</h3>
          <p>
            {question.explanation.split(",").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <div
            className="submit-button"
            onClick={onNext}
          >
            המשך
          </div>
        </div>
      )}

      {checked && !showExplanation && isAnswerCorrect && (
        <div
          className="submit-button"
          onClick={onNext}
        >
          המשך
        </div>
      )}
    </div>
  );
};

export default SequenceQuestion;
