import { Quiz } from "../components/Quiz";
import { questions } from "../data/weekdays";

export function WeekDaysQuiz() {
  return <Quiz quizName="weekdays" questions={questions} />;
}
