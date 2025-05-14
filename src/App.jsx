import React, { useState } from "react";
import "./App.css";

import leopard from "./assets/leopard.png";
import leopardPattern from "./assets/leopard2.png";
import tigerTool from "./assets/graphic-tiger-tool.svg";
import peleLanding from "./assets/pele-landing.png"; // Import the landing photo
import questions from './questions.json'; 

import WelcomeScreen from './components/WelcomeScreen';
import Header from "./components/Header";
import QuestionCard from "./components/QuestionCard";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showLandingPhoto, setShowLandingPhoto] = useState(false); // State to show landing photo

  const handleAnswer = (questionId, isCorrect) => {
    setResults((prevResults) => ({
      ...prevResults,
      [questionId]: isCorrect,
    }));
  };

  const handleNext = () => {
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
      {!showLandingPhoto && ( // Show landing photo if state is false
      <>
      <Header />
      <img src={leopard} alt="leopard" className="leopard" oncontextmenu="return false;" />
      <img src={leopardPattern} alt="leopard pattern" className="leopard-pattern" oncontextmenu="return false;" />
      </>
      )}
      {showLandingPhoto ? ( // Show landing photo if state is true
        <div className="pele-landing">
          <img src={peleLanding} alt="pele landing" className="pele-landing-photo" oncontextmenu="return false;" />
        </div>
      ) : (
        <>
          {showWelcome && <WelcomeScreen onStart={() => setShowWelcome(false)} />}
          {!showWelcome && quizCompleted && (
            <>
              <QuestionCard 
                question={questions[currentQuestionIndex]} 
                onNext={handleNext}
                onAnswer={handleAnswer}
                current={currentQuestionIndex + 1} // Pass current question index
                total={questions.length} // Pass total number of questions
              />
            </>
          )}
          {!showWelcome && !quizCompleted && (
            <div className="final-score">
              <div>סיימת את הלומדה בצורה קטלנית!</div>
              <p> ענית נכון על {calculateScore()} / {questions.length} שאלות  </p>
              <img src={tigerTool} alt="tiger tool" className="tiger-tool" oncontextmenu="return false;" />
              <button
                onClick={() => setShowLandingPhoto(true)} // Show landing photo on click
                className="finish-button"
              >
                סיים
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
