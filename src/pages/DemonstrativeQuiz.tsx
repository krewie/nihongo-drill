import { Quiz } from "../components/Quiz";
import { questions } from "../data/demonstratives";

export function DemoQuiz() {
  return <Quiz questions={questions} />;
}
