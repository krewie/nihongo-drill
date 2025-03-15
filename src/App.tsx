import { Routes, Route, useNavigate } from "react-router-dom";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu"; // 🔹 Import React-Menu
import "@szhsin/react-menu/dist/index.css"; // 🔹 Import default styles
import { DemoQuiz } from "./pages/DemonstrativeQuiz";
import { PronounsQuiz } from "./pages/PronounsQuiz";
import { WeekDaysQuiz } from "./pages/WeekDaysQuiz";

function App() {
  const navigate = useNavigate(); // 🔹 Use navigate for routing

  return (
    <div className="app">
      <h1>Krewie's 日本語 drill!</h1>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <button onClick={() => navigate("/")}>🏠 Home</button>

        {/* 🔹 Popup Quiz Menu */}
        <Menu menuButton={<MenuButton>📚 Select a Quiz ▼</MenuButton>}>
          <MenuItem onClick={() => navigate("/demoquiz")}>📌 Demonstratives Quiz</MenuItem>
          <MenuItem onClick={() => navigate("/pronounsquiz")}>🧑‍🤝‍🧑 People Pronouns Quiz</MenuItem>
          <MenuItem onClick={() => navigate("/weekdaysquiz")}>📅 Weekdays Quiz</MenuItem>
        </Menu>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demoquiz" element={<DemoQuiz />} />
        <Route path="/pronounsquiz" element={<PronounsQuiz />} />
        <Route path="/weekdaysquiz" element={<WeekDaysQuiz />} />
      </Routes>
    </div>
  );
}

function Home() {
  return <p>Welcome! Select a quiz to begin.</p>;
}

export default App;
