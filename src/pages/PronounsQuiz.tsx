import { Quiz } from "../components/Quiz";
import { questions } from "../data/pronouns";

export function PronounsQuiz() {
  return <Quiz questions={questions} />;
}
