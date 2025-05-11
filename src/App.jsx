import React, { useState } from "react";
import "./App.css";

import leopard from "./assets/leopard.png";
import leopardPattern from "./assets/leopard2.png";
import questions from './questions.json'; // Import JSON data

import WelcomeScreen from './components/WelcomeScreen';
import Header from "./components/Header";
import QuestionCard from "./components/QuestionCard";

// import TestSequence from "./TestSequence";
// import TestFillInTheBlank from "./TestFillInTheBlank";


function App() {

  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (questionId, isCorrect) => {
    setResults((prevResults) => ({
      ...prevResults,
      [questionId]: isCorrect,
    }));
  };

  const handleNext = () => {
    // Move to the next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true); 
    }
  };

  const calculateScore = () => {
    return Object.values(results).filter((isCorrect) => isCorrect).length;
  };

  return (
    <div className="App">
      <Header />
      <img src={leopard} alt="leopard" className="leopard" />
      <img src={leopardPattern} alt="leopard pattern" className="leopard-pattern" />
      {showWelcome && <WelcomeScreen onStart={() => setShowWelcome(false)} />}
      {!showWelcome && !quizCompleted &&(
        <>
          {/* Progress Bar */}
    
            <QuestionCard 
              question={questions[currentQuestionIndex]} 
              onNext={handleNext}
              onAnswer={handleAnswer}
              current={currentQuestionIndex + 1} // Pass current question index
              total={questions.length} // Pass total number of questions
            />
        </>
        // <TestSequence />
        // <TestFillInTheBlank />
      )}
         {!showWelcome && quizCompleted && (
        <div className="final-score">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {calculateScore()} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default App;
