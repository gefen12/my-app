import React from "react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import SequenceQuestion from "./questions/SequenceQuestion";
import FillInTheBlankQuestion from "./questions/FillInTheBlankQuestion";

const QuestionCard = ({ question, onNext, onAnswer }) => {

  const handleAnswer = (isCorrect) => {
    onAnswer(question.id, isCorrect); // Save the result
  };

  switch (question.type) {
    case "multiple-choice":
      return <MultipleChoiceQuestion question={question} onAnswer={handleAnswer} onNext={onNext}  />;
    case "sequence":
      return <SequenceQuestion question={question} onAnswer={handleAnswer} onNext={onNext}  />;
    case "fill-in-the-blank":
      return <FillInTheBlankQuestion question={question} onAnswer={handleAnswer} onNext={onNext}  />;
    default:
      return <div>Unknown question type</div>;
  }
};

export default QuestionCard;
