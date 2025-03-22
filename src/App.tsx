import { Routes, Route, useNavigate } from "react-router-dom";
import "@szhsin/react-menu/dist/index.css"; // 🔹 Import default styles
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { DemoQuiz } from "./pages/DemonstrativeQuiz";
import { PronounsQuiz } from "./pages/PronounsQuiz";
import { WeekDaysQuiz } from "./pages/WeekDaysQuiz";
import { KanjiReadingQuiz } from "./pages/KanjiReadingQuiz";
import { MinnaNoNihongo } from "./pages/MinnaNoQuiz";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// These should already be available if you're using ShadCN
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FlashDrills from "./pages/FlashDrills";


function App() {
  const navigate = useNavigate(); // 🔹 Use navigate for routing
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isFlashDeck = location.pathname === "/flashdrill";
  const [selectedJlpt, setSelectedJlpt] = useState<number>(0);

  return (
    <div className="scale-[1.6] origin-top-left w-[62.5%] h-[62.5%] overflow-hidden fixed top-0 left-0">
          <h1 className="scroll-m-20 border-b pb-5 text-3xl font-semibold tracking-tight first:mt-0">
          クリスの日本語ドリル！
        </h1>

        <div className="flex items-center gap-2 pt-5 flex-wrap">
  <Button onClick={() => navigate("/")} variant="outline">
    🏠
  </Button>

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

  {isFlashDeck && (
    <Select
      value={selectedJlpt.toString()}
      onValueChange={(val: string) => setSelectedJlpt(Number(val))}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="JLPT" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">All</SelectItem>
        <SelectItem value="5">N5</SelectItem>
        <SelectItem value="4">N4</SelectItem>
        <SelectItem value="3">N3</SelectItem>
        <SelectItem value="2">N2</SelectItem>
        <SelectItem value="1">N1</SelectItem>
      </SelectContent>
    </Select>
  )}
</div>



      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demoquiz" element={<DemoQuiz />} />
        <Route path="/pronounsquiz" element={<PronounsQuiz />} />
        <Route path="/weekdaysquiz" element={<WeekDaysQuiz />} />
        <Route path="/kanjireadingquiz" element={<KanjiReadingQuiz />} />
        <Route path="/MinnaNoNihongo" element={<MinnaNoNihongo />} />
        <Route path="/flashdrill" element={<FlashDrills key={`jlpt-${selectedJlpt}`} jlpt={selectedJlpt}/>} />
      </Routes>
    </div>
  );
}

function Home() {
  return <p>Welcome! Select a quiz to begin.</p>;
}

export default App;
