import React, { useState } from 'react';
import DraggableItem from "../dnd/DraggableItem";
import DroppableArea from "../dnd/DroppableArea";
import './FillInTheBlankQuestion.css';
import ProgressBar from '../ProgressBar.jsx';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export default function FillInTheBlank({ question, onAnswer, onNext, current, total }) {
  const initializedOptions = question.options.map((word, i) => ({
    id: `${word}-${i}`,
    word,
  }));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevent accidental drag on click
      },
    })
  );
  const [answers, setAnswers] = useState(
    question.blocks.map((block) => block.correctWords.map(() => null))
  );
  const [options, setOptions] = useState(initializedOptions);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDragEnd = ({ active, over }) => {
    document.body.style.overflow = "auto"; // Re-enable scroll
  
    if (!over) return;
  
    const fromId = active.id;
    const toId = over.id;
  
    // If dropped in the same spot, do nothing
    if (fromId === toId) return;
  
    // Check if dropping into a blank
    if (toId.startsWith("blank-")) {
      const [_, rowIndex, blankIndex] = toId.split("-");
  
      // Make sure blank is empty
      if (answers[rowIndex][blankIndex]) return;
  
      // Find dragged word in options
      const draggedWord = options.find((w) => w.id === fromId);
      if (!draggedWord) return;
  
      // Place the word in the blank
      const newAnswers = [...answers];
      newAnswers[rowIndex][blankIndex] = draggedWord;
      setAnswers(newAnswers);
  
      // Remove from options
      setOptions(options.filter((w) => w.id !== fromId));
    }
  
    // Check if moving from blank back to options
    if (fromId.startsWith("blank-") && toId === "options") {
      const [_, rowIndex, blankIndex] = fromId.split("-");
      const removedWord = answers[rowIndex][blankIndex];
  
      if (!removedWord) return;
  
      const newAnswers = [...answers];
      newAnswers[rowIndex][blankIndex] = null;
      setAnswers(newAnswers);
      setOptions([...options, removedWord]);
    }
  };
  
  const isCorrect = (rowIndex) => {
    const correctWords = question.blocks[rowIndex].correctWords;
    const userWords = answers[rowIndex].map((a) => a?.word || null);
    return correctWords.length === userWords.length && correctWords.every((word, i) => word === userWords[i]);
  };

  const checkAnswers = () => {
    setSubmitted(true);
    const allCorrect = question.blocks.every((_, rowIndex) => isCorrect(rowIndex));
    if (allCorrect) {
      onAnswer(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setShowExplanation(true);
      }
    }
  };

  const resetQuestion = () => {
    setAnswers(question.blocks.map((block) => block.correctWords.map(() => null)));
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
          {question.question}
        </h2>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          {question.blocks.map((block, rowIndex) => {
            const parts = block.text.split("_");
            return (
              <div className="sentence-block" key={rowIndex}>
                {parts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < block.correctWords.length && (
                      <DroppableArea id={`blank-${rowIndex}-${i}`}>
                        {answers[rowIndex][i] ? (
                          <DraggableItem id={`blank-${rowIndex}-${i}`}>
                            {answers[rowIndex][i].word}
                          </DraggableItem>
                        ) : (
                          <span className="empty-slot"></span>
                        )}
                      </DroppableArea>
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

          <DroppableArea id="options">
            <div className="word-bank">
              {options.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                  {item.word}
                </DraggableItem>
              ))}
            </div>
          </DroppableArea>
        </DndContext>
      </>
    )}

    {!submitted && !showExplanation && (
      <div className="submit-buttonF" onClick={checkAnswers}>
        בדוק
      </div>
    )}

    {submitted && !showExplanation && !question.blocks.every((_, rowIndex) => isCorrect(rowIndex)) && attempts < 2 && (
      <div className="submit-buttonF" onClick={resetQuestion}>
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
      <div className="submit-buttonF" onClick={onNext}>
        המשך
      </div>
    )}
  </div>
);
}