import React, { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable
  } from "@hello-pangea/dnd";
import "./SequenceQuestion.css";

const SequenceQuestion = ({ question, onNext, onAnswer }) => {
  const [currentOrder, setCurrentOrder] = useState(
    question.steps.map((_, i) => i)
  );
  const [checked, setChecked] = useState(false);

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

    onAnswer(isCorrect); // Pass the result to the parent
  };
  
  const isCorrect = (index) =>
    currentOrder[index] === question.correctOrder[index];

  return (
    <div className="question-card">
      <div className="question-text">{question.question}</div>
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

      {!checked && (
        <div className="submit-button" onClick={handleSubmit}>
          בדוק
        </div>
      )}
      {checked && (
        <div className="submit-button" onClick={onNext}>
          המשך
        </div>
      )}
    </div>
  );
};

export default SequenceQuestion;
