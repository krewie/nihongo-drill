import { useState, useRef, useEffect } from "react";
import { toHiragana } from "wanakana";
import "../styles.css";

type QuizProps = {
  questions: { question: string; answers: string[] }[];
};

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("asdasdasdasd");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Keep input field focused
    }
  }, [userAnswer, submitted]);

  const handleSubmit = () => {
    if (!submitted) {
      const normalizedInput = normalizeAnswer(userAnswer);
      const correctAnswers = questions[currentQuestion].answers.map(normalizeAnswer);

      if (correctAnswers.includes(normalizedInput)) {
        setFeedback("✅ Correct!");
        setIsCorrect(true);
        setCorrectCount((prev) => prev + 1);
      } else {
        setFeedback(`❌ Incorrect! The answer is: ${questions[currentQuestion].answers.join(" / ")}`);
        setIsCorrect(false);
        setIncorrectCount((prev) => prev + 1);
      }
      setSubmitted(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setUserAnswer("");
      setSubmitted(false);
      setIsCorrect(false);
      setTimeout(() => setFeedback(""), 500);
    } else {
      setFeedback("🎉 Quiz Complete! Refresh to try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!submitted && userAnswer.trim()) {
        handleSubmit();
      } else {
        nextQuestion();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
    setFeedback("");
    setSubmitted(false);
  };

  return (
    <div className="quiz-container">
      {/* Fixed Feedback Bar */}
      <div className={`feedback-bar ${submitted ? (isCorrect ? "correct" : "incorrect") : ""}`}>
        {submitted ? (
          <span className="feedback-text">{feedback}</span>
        ) : (
          <span className="feedback-text">
            Q{currentQuestion + 1}/{questions.length} - ✅ {correctCount} | ❌ {incorrectCount}
          </span>
        )}
      </div>

      {/* Wrapper for Question and Answer Display */}
      <div className="content-wrapper">
        <div className="question-text">{questions[currentQuestion].question}</div>

        {/* Transparent Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="visible-input"
          autoFocus
        />
      </div>

      {/* Buttons at the Bottom */}
      <div className="button-container">
        <button onClick={handleSubmit} disabled={submitted}>Submit</button>
        {submitted && currentQuestion < questions.length - 1 && (
          <button onClick={nextQuestion}>Next</button>
        )}
        {submitted && currentQuestion === questions.length - 1 && (
          <button onClick={() => {
            setCurrentQuestion(0);
            setUserAnswer("");
            setFeedback("");
            setSubmitted(false);
            setIsCorrect(false);
            setCorrectCount(0);
            setIncorrectCount(0);
          }}>Restart Quiz</button>
        )}
      </div>
    </div>
  );
}

const normalizeAnswer = (text: string) => {
  return toHiragana(text.trim())
    .normalize("NFKC")
    .replace(/\s+/g, "");
};
