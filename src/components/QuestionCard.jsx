import React from "react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import SequenceQuestion from "./questions/SequenceQuestion";
import FillInTheBlankQuestion from "./questions/FillInTheBlankQuestion";

const QuestionCard = ({ question, onNext, onAnswer, current, total }) => {
  const handleAnswer = (isCorrect) => {
    onAnswer(question.id, isCorrect); // Save the result
  };

  return (
    <div>

      {/* Render the appropriate question type */}
      {question.type === "multiple-choice" && (
        <MultipleChoiceQuestion question={question} onAnswer={handleAnswer} onNext={onNext} current={current} total={total} />
      )}
      {question.type === "sequence" && (
        <SequenceQuestion question={question} onAnswer={handleAnswer} onNext={onNext}  current={current} total={total} />
      )}
      {question.type === "fill-in-the-blank" && (
        <FillInTheBlankQuestion question={question} onAnswer={handleAnswer} onNext={onNext}  current={current} total={total} />
      )}
    </div>
  );
};

export default QuestionCard;