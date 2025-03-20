import { useState, useRef, useEffect } from "react";
import { toHiragana } from "wanakana";
import "../styles.css";
import supabase from "../supabase";

type QuizProps = {
  quizName: string;
  questions: { question: string; answers: string[] }[];
};

export function Quiz({ quizName, questions: initialQuestions }: QuizProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = "550e8400-e29b-41d4-a716-446655440000"; // Replace with actual authentication later

  useEffect(() => {
    async function loadPastMistakes() {
      const pastMistakes = await fetchUserQuizHistory(userId, quizName, initialQuestions);
      if (pastMistakes.length > 0) {
        setQuestions(shuffleArray([...pastMistakes, ...initialQuestions]));
      }
    }
    loadPastMistakes();
  }, [initialQuestions, quizName]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [userAnswer, submitted]);

  const handleSubmit = async () => {
    if (!submitted) {
      const normalizedInput = normalizeAnswer(userAnswer);
      const currentQ = initialQuestions.find(q => q.question === questions[currentQuestion].question);

      if (!currentQ) {
        console.error("❌ Error: Question not found in initialQuestions!");
        return;
      }

      const correctAnswers = currentQ.answers.map(normalizeAnswer);
      const isAnswerCorrect = correctAnswers.includes(normalizedInput);

      setFeedback(
        isAnswerCorrect
          ? "✅ Correct!"
          : `❌ Incorrect! The correct answer was: ${currentQ.answers.join(" / ")}`
      );

      setIsCorrect(isAnswerCorrect);
      setSubmitted(true);

      await saveQuizAttempt(userId, quizName, currentQ.question, isAnswerCorrect);

      if (isAnswerCorrect) {
        setCorrectCount(prev => prev + 1);
      } else {
        setIncorrectCount(prev => prev + 1);
      }
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const repeatedQuestions = await fetchUserQuizHistory(userId, quizName, initialQuestions);
  
      if (repeatedQuestions.length === 0) {
        console.log("✅ No more mistakes left to review! Ending quiz.");
        setQuizFinished(true);
        return;
      }
  
      console.log(`🔄 Fetching past mistakes: ${repeatedQuestions.length} questions need improvement`);
  
      setQuestions(shuffleArray([...repeatedQuestions, ...initialQuestions]));
      setCurrentQuestion(0);
    }
  
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setTimeout(() => setFeedback(""), 500);
  };  

  const restartQuiz = () => {
    setQuestions(initialQuestions);
    setCurrentQuestion(0);
    setUserAnswer("");
    setFeedback("");
    setSubmitted(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="result-screen">
        <h2>Quiz Results</h2>
        <p>✅ Correct: {correctCount} | ❌ Incorrect: {incorrectCount}</p>
        <p>Total Questions: {correctCount + incorrectCount}</p>
        <p>Accuracy: {((correctCount / (correctCount + incorrectCount)) * 100).toFixed(2)}%</p>
        <button onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className={`quiz-container ${submitted ? (isCorrect ? "correct-bg" : "incorrect-bg") : ""}`}>
      <div className="content-wrapper">
          <div 
          className="question-text" 
          onClick={() => speak(questions[currentQuestion].question)}
          style={{ cursor: "pointer", textDecoration: "underline" }}
          >
          {questions[currentQuestion].question}
          </div>
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (!submitted ? handleSubmit() : nextQuestion())}
          className="visible-input"
          autoFocus
        />
        {submitted && <div className="feedback-text">{feedback}</div>}
      </div>
      <div className="button-container">
        <button onClick={handleSubmit} disabled={submitted} className="submit-button">Submit</button>
        {submitted && <button onClick={nextQuestion}>Next</button>}
        <button onClick={() => setQuizFinished(true)} className="stop-button">Stop Quiz</button>
      </div>
    </div>
  );
}

const normalizeAnswer = (text: string) => toHiragana(text.trim()).normalize("NFKC").replace(/\s+/g, "");

export async function saveQuizAttempt(userId: string, quizType: string, question: string, correct: boolean) {
  if (!userId || !quizType || !question) {
    console.error("❌ Missing required parameters for saveQuizAttempt");
    return;
  }

  const { data: existingRecord } = await supabase
    .from("quiz_attempts")
    .select("correct_count, incorrect_count")
    .eq("user_id", userId)
    .eq("quiz_type", quizType)
    .eq("question", question)
    .maybeSingle();

  if (existingRecord) {
    await supabase
      .from("quiz_attempts")
      .update({
        correct_count: existingRecord.correct_count + (correct ? 1 : 0),
        incorrect_count: existingRecord.incorrect_count + (!correct ? 1 : 0),
      })
      .eq("user_id", userId)
      .eq("quiz_type", quizType)
      .eq("question", question);
  } else {
    await supabase
      .from("quiz_attempts")
      .insert([{ user_id: userId, quiz_type: quizType, question, correct_count: correct ? 1 : 0, incorrect_count: correct ? 0 : 1 }]);
  }
}

export async function fetchUserQuizHistory(userId: string, quizType: string, initialQuestions: { question: string; answers: string[] }[]) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("question, correct_count, incorrect_count")
    .eq("user_id", userId)
    .eq("quiz_type", quizType)
    .order("incorrect_count", { ascending: false });

  if (error) {
    console.error("❌ Error fetching quiz history:", error);
    return [];
  }

  const filteredQuestions = data.filter((q: { question: string; correct_count: number; incorrect_count: number }) => {
    const existsInQuestions = initialQuestions.some((orig) => orig.question === q.question);
    if (!existsInQuestions) return false;
  
    const totalAttempts = q.correct_count + q.incorrect_count;
    if (totalAttempts === 0) return true;
  
    const accuracy = q.correct_count / totalAttempts;
  
    if (accuracy >= 0.8) {
      console.log(`⏭️ IGNORING Question: "${q.question}" | 🎯 Accuracy: ${(accuracy * 100).toFixed(2)}%`);
      return false;
    }
  
    return true;
  });  

  console.log(`🔄 Fetching past mistakes: ${filteredQuestions.length} questions need improvement`);

  return filteredQuestions.length > 0 ? filteredQuestions : [];
}

const speak = (text: string) => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis is not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP"; // Set to Japanese
  utterance.rate = 0.9; // Adjust speech speed
  utterance.pitch = 1.1; // Adjust pitch for a natural tone

  speechSynthesis.speak(utterance);
};

const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);
