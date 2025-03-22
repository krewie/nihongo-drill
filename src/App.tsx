import { Routes, Route, useNavigate } from "react-router-dom";
import "@szhsin/react-menu/dist/index.css"; // 🔹 Import default styles
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { DemoQuiz } from "./pages/DemonstrativeQuiz";
import { PronounsQuiz } from "./pages/PronounsQuiz";
import { WeekDaysQuiz } from "./pages/WeekDaysQuiz";
import { KanjiReadingQuiz } from "./pages/KanjiReadingQuiz";
import { MinnaNoNihongo } from "./pages/MinnaNoQuiz";
import { FlashDrills } from "./pages/FlashDrills";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function App() {
  const navigate = useNavigate(); // 🔹 Use navigate for routing
  const { theme, setTheme } = useTheme();

  return (
    <div className="app">
      <h1>Krewie's 日本語 drill!</h1>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <Button onClick={() => navigate("/")} variant="outline">
          🏠
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* 🔹 Popup Quiz Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">📚 Select a Quiz ▼</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate("/demoquiz")}>
              📌 Demonstratives Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/pronounsquiz")}>
              🧑‍🤝‍🧑 People Pronouns Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/weekdaysquiz")}>
              📅 Weekdays Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/kanjireadingquiz")}>
              🔰 Kanji Reading Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/MinnaNoNihongo")}>
              🔰 Minna No Nihongo Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/flashdrill")}>
              🃏 Flash Drill
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demoquiz" element={<DemoQuiz />} />
        <Route path="/pronounsquiz" element={<PronounsQuiz />} />
        <Route path="/weekdaysquiz" element={<WeekDaysQuiz />} />
        <Route path="/kanjireadingquiz" element={<KanjiReadingQuiz />} />
        <Route path="/MinnaNoNihongo" element={<MinnaNoNihongo />} />
        <Route path="/flashdrill" element={<FlashDrills />} />
      </Routes>
    </div>
  );
}

function Home() {
  return <p>Welcome! Select a quiz to begin.</p>;
}

export default App;
