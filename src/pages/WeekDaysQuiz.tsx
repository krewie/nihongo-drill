import { Quiz } from "../components/Quiz";
import { questions } from "../data/weekdays";

export function WeekDaysQuiz() {
  return <Quiz questions={questions} />;
}
