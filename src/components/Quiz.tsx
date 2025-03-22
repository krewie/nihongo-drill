import { useState, useRef, useEffect } from "react";
import { toHiragana } from "wanakana";
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
    <div className="flex justify-center pt-5 px-4">
      <div className={`
        rounded-2xl shadow-lg p-6 max-w-xl w-full border transition-all duration-300
        ${submitted ? (isCorrect ? "border-green-400" : "border-red-400") : "border-gray-200 dark:border-neutral-700"}
      `}>
        
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">{quizName}</h2>
  
        <div className="quiz-container">
          <div className="content-wrapper">
            <div
              className="question-text text-lg font-medium mb-4 text-center cursor-pointer underline text-gray-900 dark:text-white"
              onClick={() => speak(questions[currentQuestion].question)}
            >
              {questions[currentQuestion].question}
            </div>
  
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (!submitted ? handleSubmit() : nextQuestion())}
              className="w-full border rounded-md px-3 py-2 mb-3 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
  
            {submitted && (
              <div className={`feedback-text mb-3 text-center font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                {feedback}
              </div>
            )}
          </div>
  
          <div className="button-container flex justify-center gap-4 mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-500 dark:disabled:bg-neutral-600"
            >
              Submit
            </button>
  
            {submitted && (
              <button
                onClick={nextQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Next
              </button>
            )}
  
            <button
              onClick={() => setQuizFinished(true)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-neutral-600 dark:text-white"
            >
              Stop Quiz
            </button>
          </div>
        </div>
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
