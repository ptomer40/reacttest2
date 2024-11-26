import React, { useState, useEffect } from "react";  
import "./quiz.css";

const questions = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: "4" },
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: "Paris" },
  { question: "What is 5 * 3?", options: ["15", "20", "25", "30"], correctAnswer: "15" },
  { question: "What is the color of the sky?", options: ["Blue", "Green", "Red", "Yellow"], correctAnswer: "Blue" },
  { question: "What is 10 / 2?", options: ["3", "4", "5", "6"], correctAnswer: "5" },
  { question: "What is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: "Jupiter" },
  { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "H2"], correctAnswer: "H2O" },
  { question: "What is 20 - 4?", options: ["12", "14", "16", "18"], correctAnswer: "16" },
  { question: "What is the tallest mountain?", options: ["K2", "Everest", "Kangchenjunga", "Makalu"], correctAnswer: "Everest" },
  { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "400,000 km/s", "350,000 km/s"], correctAnswer: "300,000 km/s" },
];

function Quiz() {
    const [userName, setUserName] = useState(""); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]); 
    const [timer, setTimer] = useState(15); 
    const [score, setScore] = useState(0); 
    const [quizStarted, setQuizStarted] = useState(false); 
    const [quizFinished, setQuizFinished] = useState(false); 
    const [answered, setAnswered] = useState(false); 

    useEffect(() => {
      if (quizStarted && timer > 0 && !quizFinished && !answered) {
        const timerInterval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerInterval);
      } else if (timer === 0 && !quizFinished && !answered) {
        handleTimeout(); 
      }
    }, [timer, quizStarted, quizFinished, answered]);

    const handleAnswerSelect = (answer) => {
      if (answered) return; 

      const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = { answer, isCorrect };
      setUserAnswers(updatedAnswers);

      if (isCorrect) {
        setScore(score + 5);
      }

      setAnswered(true);
      setTimer(0); 
    };

    
    const handleTimeout = () => {
      if (answered) return;

      const correctAnswer = questions[currentQuestionIndex].correctAnswer;
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = { answer: correctAnswer, isCorrect: true };
      setUserAnswers(updatedAnswers);
      setTimer(0); 
      setAnswered(true); 
      handleNext(); 
    };

    
    const handleNext = () => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswered(false); 
        setTimer(15); 
      } else {
        setQuizFinished(true);
      }
    };

    // Restart the quiz
    const handleStartOver = () => {
      setUserName("");
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setScore(0);
      setQuizFinished(false);
      setQuizStarted(false); 
      setTimer(15);
      setAnswered(false); 
    };

    
    const handleStartQuiz = () => {
      if (userName.trim()) {
        setQuizStarted(true); 
        setCurrentQuestionIndex(0);
        setTimer(15); 
        setAnswered(false); 
      }
    };

    return (
      <div className="Quiz">
        
        {!quizStarted ? (
          <div style={{ marginLeft:'300px', backgroundColor:'black', width:'400px', height:'400px'}} className="name-input">
            
            <div><h4 style={{color:"white"}}>ABES Quiz Platform</h4></div>
            <div><h5 style={{color:"brown"}}>Contestant Name</h5>
            <br></br>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Contestant Name"
            />
            
            <button onClick={handleStartQuiz} disabled={!userName.trim()}>
              Start Quiz
            </button>
            </div>
          </div>
        ) : quizFinished ? (
          <div className={`result ${score > 25 ? "awesome" : "oops"}`}>
            <h2>{score > 25 ? "Awesome!" : "Oops!"}</h2>
            <p>Your score: {score}/50</p>
            <button onClick={handleStartOver}>Start Over</button>
          </div>
        ) : (
          <div className="quiz-container">
            <h2>Contestant: {userName}!</h2> {/* Display the user's name here */}
            <h2>{`${currentQuestionIndex + 1}/10`}</h2>
            <h3>Score: {score}/{(currentQuestionIndex + 1) * 5}</h3>
            <h4>Time Remaining: {timer} seconds</h4>

            <div className="question-card">
              <h3>{questions[currentQuestionIndex].question}</h3>
              <div className="options">
                {questions[currentQuestionIndex].options.map((option, index) => {
                  const isSelected = userAnswers[currentQuestionIndex]?.answer === option;
                  const isCorrect = questions[currentQuestionIndex].correctAnswer === option;
                  const isIncorrect = isSelected && !isCorrect;

                  let buttonClass = "";
                  if (isSelected) {
                    buttonClass = isCorrect ? "correct" : "incorrect"; 
                  } else if (isCorrect && answered) {
                    buttonClass = "correct"; 
                  } else if (isIncorrect && answered) {
                    buttonClass = "incorrect";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={buttonClass}
                      disabled={answered} 
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="controls">
              <button onClick={handleNext} disabled={!answered}>
                {currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
}

export default Quiz;
