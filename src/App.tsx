import { Routes, Route, useNavigate } from "react-router-dom";
import { DemoQuiz } from "./pages/DemonstrativeQuiz";
import { PronounsQuiz } from "./pages/PronounsQuiz";

function App() {
  const navigate = useNavigate(); // 🔹 Use navigate for button-based routing

  return (
    <div className="app">
      <h1>Krewie's 日本語 drill!</h1>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/demoquiz")}>Demonstratives Quiz</button>
        <button onClick={() => navigate("/pronounsquiz")}>People Pronouns Quiz</button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demoquiz" element={<DemoQuiz />} />
        <Route path="/pronounsquiz" element={<PronounsQuiz />} />
      </Routes>
    </div>
  );
}

function Home() {
  return <p>Welcome! Select a quiz to begin.</p>;
}

export default App;
