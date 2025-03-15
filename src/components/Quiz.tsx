import { useState, useRef, useEffect } from "react";
import { toHiragana } from "wanakana";
import "../styles.css";

type QuizProps = {
  questions: { question: string; answers: string[] }[];
};

type ResultEntry = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [userAnswer, submitted]);

  const handleSubmit = () => {
    if (!submitted) {
      const normalizedInput = normalizeAnswer(userAnswer);
      const correctAnswers = questions[currentQuestion].answers.map(normalizeAnswer);
      const isAnswerCorrect = correctAnswers.includes(normalizedInput);

      setFeedback(
        isAnswerCorrect
          ? "✅ Correct!"
          : `❌ Incorrect!\nThe answer is: \n${questions[currentQuestion].answers.join(" / ")}`
      );
      
      setIsCorrect(isAnswerCorrect);
      setSubmitted(true);

      setResults((prev) => [
        ...prev,
        {
          question: questions[currentQuestion].question,
          userAnswer: userAnswer || "(empty)",
          correctAnswer: questions[currentQuestion].answers.join(" / "),
          isCorrect: isAnswerCorrect,
        },
      ]);

      if (isAnswerCorrect) {
        setCorrectCount((prev) => prev + 1);
      } else {
        setIncorrectCount((prev) => prev + 1);
      }
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
      setQuizFinished(true);
    }
  };

  const stopQuiz = () => {
    setQuizFinished(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswer("");
    setFeedback("");
    setSubmitted(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setResults([]);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="result-screen">
        <h2>Quiz Results</h2>
        <p>✅ Correct: {correctCount} | ❌ Incorrect: {incorrectCount}</p>

        <div className="result-list">
          {results.map((r, index) => (
            <div key={index} className={`result-item ${r.isCorrect ? "correct" : "incorrect"}`}>
              <p><strong>Q:</strong> {r.question}</p>
              <p><strong>Your Answer:</strong> {r.userAnswer}</p>
              {!r.isCorrect && <p><strong>Correct Answer:</strong> {r.correctAnswer}</p>}
            </div>
          ))}
        </div>

        <button onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className={`quiz-container ${submitted ? (isCorrect ? "correct-bg" : "incorrect-bg") : ""}`}>
      <div className="content-wrapper">
      <div className={`question-text ${submitted ? (isCorrect ? "correct" : "incorrect") : ""}`}>
        {submitted ? (
          <span className="feedback-text">{feedback}</span>
        ) : (
          <span className="feedback-text">
            Q{currentQuestion + 1}/{questions.length} - ✅ {correctCount} | ❌ {incorrectCount}
          </span>
        )}
      </div>

        <div className="question-text">{questions[currentQuestion].question}</div>
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (!submitted ? handleSubmit() : nextQuestion())}
          className="visible-input"
          autoFocus
        />
      </div>

      <div className="button-container">
        <button onClick={handleSubmit} disabled={submitted}>Submit</button>
        {submitted && currentQuestion < questions.length - 1 && (
          <button onClick={nextQuestion}>Next</button>
        )}
        <button onClick={stopQuiz} className="stop-button">Stop Quiz</button>
      </div>
    </div>
  );
}

const normalizeAnswer = (text: string) => {
  return toHiragana(text.trim()).normalize("NFKC").replace(/\s+/g, "");
};
