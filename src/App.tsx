import { Routes, Route, Link } from "react-router-dom";
import { DemoQuiz } from "./pages/DemonstrativeQuiz";
import { PronounsQuiz } from "./pages/PronounsQuiz";

function App() {
  return (
    <div className="app">
      <h1>My Quiz App</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/demoquiz">Demonstratives Quiz</Link></li>
          <li><Link to="/pronounsquiz">People Pronouns Quiz</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demoquiz" element={<DemoQuiz />} />
        <Route path="/pronounsquiz" element={<PronounsQuiz />} />
      </Routes>
    </div>
  );
}

function Home() {
  return <h2>Welcome! Select a quiz from the navigation.</h2>;
}

export default App;
