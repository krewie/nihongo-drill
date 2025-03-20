import { Quiz } from "../components/Quiz";
import { questions } from "../data/minnanonihongo";

export function MinnaNoNihongo() {
  return <Quiz quizName="MinnaNoNihongo" questions={questions} />;
}
