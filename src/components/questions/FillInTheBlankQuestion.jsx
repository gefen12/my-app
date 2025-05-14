import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./FillInTheBlankQuestion.css";
import ProgressBar from "../ProgressBar.jsx"; // Import the ProgressBar component

export default function FillInTheBlank({ question, onAnswer, onNext, current, total }) {
    // Create unique IDs for options
    const initializedOptions = question.options.map((word, i) => ({
      id: `${word}-${i}`,
      word,
    }));
  
    // Each answer row has as many blanks as there are correct words
    const [answers, setAnswers] = useState(
      question.blocks.map((block) =>
        block.correctWords.map(() => null)
      )
    );
    const [options, setOptions] = useState(initializedOptions);
    const [submitted, setSubmitted] = useState(false);
    const [attempts, setAttempts] = useState(0); // Track the number of attempts
    const [showExplanation, setShowExplanation] = useState(false); // Show explanation after 2 incorrect attempts

    
    const onDragEnd = ({ source, destination, draggableId }) => {
      if (!destination) return;
  
      const sourceId = source.droppableId;
      const destId = destination.droppableId;
  
      // from options to a blank
      if (sourceId === "options" && destId.startsWith("blank-")) {
        const [_, row, blank] = destId.split("-");
        const wordObj = options.find((w) => w.id === draggableId);
        if (!wordObj) return;
  
        // Only allow placing in empty slot
        if (answers[row][blank]) return;
  
        const newAnswers = [...answers];
        newAnswers[row][blank] = wordObj;
        setAnswers(newAnswers);
        setOptions(options.filter((w) => w.id !== draggableId));
      }
  
      // from blank back to options
      if (sourceId.startsWith("blank-") && destId === "options") {
        const [_, row, blank] = sourceId.split("-");
        const wordObj = answers[row][blank];
        if (!wordObj) return;
  
        const newAnswers = [...answers];
        newAnswers[row][blank] = null;
        setAnswers(newAnswers);
        setOptions([...options, wordObj]);
      }
    };
  
    const isCorrect = (rowIndex) => {
      const correctWords = question.blocks[rowIndex].correctWords;
      const userWords = answers[rowIndex].map((a) => a?.word || null);

      return (
        correctWords.length === userWords.length &&
        correctWords.every((word, i) => word === userWords[i])
      );
    };
  
    const checkAnswers = () => {
        setSubmitted(true);
        // Check if all rows are correct
        const allCorrect = question.blocks.every((_, rowIndex) => isCorrect(rowIndex));
        if (allCorrect) {
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
      setAnswers(
        question.blocks.map((block) =>
          block.correctWords.map(() => null)
        )
      );
      setOptions(initializedOptions);
      setSubmitted(false);
      setShowExplanation(false);
    };
  
    return (
      <div className="fill-container">
        {!showExplanation && (
          <>
        <h2 className="title-fill">
          <ProgressBar current={current} total={total} />
          {question.question}</h2>
        <DragDropContext onDragEnd={onDragEnd}   
          onDragStart={() => {
           document.body.style.overflow = 'hidden'; }}
      >
          {question.blocks.map((block, rowIndex) => {
            const parts = block.text.split("_");
            return (
              <div className="sentence-block" key={rowIndex}>
                {parts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < block.correctWords.length && (
                      <Droppable droppableId={`blank-${rowIndex}-${i}`}>
                        {(provided) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="drop-slot"
                          >
                            {answers[rowIndex][i] ? (
                              <Draggable
                                draggableId={answers[rowIndex][i].id}
                                index={0}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="drop-word"
                                  >
                                    {answers[rowIndex][i].word}
                                  </span>
                                )}
                              </Draggable>
                            ) : (
                              <span className="empty-slot"></span>
                            )}
                            {provided.placeholder}
                          </span>
                        )}
                      </Droppable>
                    )}
                  </span>
                ))}
                {submitted && (
                  <span className={`check-result ${isCorrect(rowIndex) ? "correct" : "wrong"}`}>
                    {isCorrect(rowIndex) ? "✔️" : "❌"}
                  </span>
                )}
              </div>
            );
          })}
  
         
          <Droppable droppableId="options" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="word-bank">
                {options.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="word"
                      >
                        {item.word}
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
        {!submitted && !showExplanation && (
          <div className="submit-button" onClick={checkAnswers}>
            בדוק
          </div>
        )}

        {submitted && !showExplanation && !question.blocks.every((_, rowIndex) => isCorrect(rowIndex)) && attempts < 2 && (
          <div className="submit-button" onClick={resetQuestion}>
            נסה שוב
          </div>
        )}

        {showExplanation && (
          <div className="explanation">
            <h3>הסבר:</h3>
            <p>{question.explanation}</p>
            <div className="submit-button" onClick={onNext}>
              המשך
            </div>
          </div>
        )}

        {submitted && !showExplanation && question.blocks.every((_, rowIndex) => isCorrect(rowIndex)) && (
          <div className="submit-button" onClick={onNext}>
            המשך
          </div>
        )}
      </div>
    );
  }