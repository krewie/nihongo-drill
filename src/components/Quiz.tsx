import { useState } from "react";
import { QuestionCard } from "./QuestionCard";

const questions = [
  { question: "What is 'this' in Japanese?", answer: "これ" },
  { question: "What is 'that' (near listener) in Japanese?", answer: "それ" },
  { question: "What is 'that' (far away) in Japanese?", answer: "あれ" },
];

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (userAnswer.trim() === questions[currentQuestion].answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect! The answer is: ${questions[currentQuestion].answer}`);
    }
    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setUserAnswer(""); // Clear the input field
      setFeedback(""); // Reset feedback
      setSubmitted(false); // Reset submission state
    }
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!submitted && userAnswer.trim()) {
        handleSubmit(); // Submit answer
      } else {
        nextQuestion(); // Move to next question if already submitted or empty input
      }
    }
  };

  return (
    <div className="quiz">
      <QuestionCard
        question={questions[currentQuestion].question}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        onKeyDown={handleKeyDown} // Pass event handler to input
      />
      <button onClick={handleSubmit} disabled={submitted}>Submit</button>
      <p>{feedback}</p>
      {currentQuestion < questions.length - 1 && (
        <button onClick={nextQuestion}>Next</button>
      )}
    </div>
  );
}

