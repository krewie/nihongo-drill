import { Quiz } from "../components/Quiz";
import { questions } from "../data/kanji";

export function KanjiReadingQuiz() {
  return <Quiz questions={questions} />;
}
