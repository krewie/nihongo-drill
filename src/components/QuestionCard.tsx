type QuestionCardProps = {
    question: string;
    userAnswer: string;
    setUserAnswer: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void; // New prop
  };
  
  export function QuestionCard({ question, userAnswer, setUserAnswer, onKeyDown }: QuestionCardProps) {
    return (
      <div className="question-card">
        <h2>{question}</h2>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={onKeyDown} // Handle Enter key
          placeholder="Type your answer here..."
        />
      </div>
    );
  }
  