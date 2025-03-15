import { Quiz } from "../components/Quiz";
import { questions } from "../data/kanji";

export function KanjiReadingQuiz() {
  return <Quiz quizName="kanjireading" questions={questions} />;
}
