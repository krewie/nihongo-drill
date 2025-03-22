import { useSlidingKanjiDeck } from "@/hooks/useSlidingDeck";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export default function FlashCardDeck() {
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [flipped, setFlipped] = useState(false);

  const {
    currentCard,
    loading,
    next,
    prev,
    canGoBack,
    canGoForward,
  } = useSlidingKanjiDeck({ chunkSize: 20, windowSize: 60 });

  const speak = (text: string) => {
    if (muted || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = rate;
    utterance.pitch = 0.5;
    speechSynthesis.speak(utterance);
  };

  const toggleRate = () => {
    setRate((r) => (r === 1.0 ? 0.5 : 1.0));
  };

  if (!currentCard && !loading) {
    return <div className="text-center mt-10">No card loaded.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {currentCard && (
        <motion.div
          className="relative border rounded-2xl p-6 text-center shadow-md w-full max-w-xs h-[36rem] mt-6"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(_event, info) => {
            if (info.offset.x > 150 && canGoBack) {
              prev();
            } else if (info.offset.x < -150 && canGoForward) {
              next();
            }
          }}
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 🔘 Top button row */}
          <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center px-2">
            {/* Mute */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            {/* Flip */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFlipped(!flipped)}
            >
              {flipped ? "Show Front" : "Flip Card"}
            </Button>

            {/* Rate */}
            <Button variant="outline" size="sm" onClick={toggleRate}>
              {rate === 0.5 ? "🐢 Slow" : "🧍 Normal"}
            </Button>
          </div>

          {/* 🔄 Card Content */}
          {flipped ? (
            <div className="mt-14">
              {/* Kanji (still clickable for speech) */}
              <div
                className="text-6xl sm:text-7xl mt-6"
                onClick={() => speak(currentCard.kanji)}
              >
                {currentCard.kanji}
              </div>

              {/* Meanings */}
              <div className="text-sm font-medium mb-1 pt-5">
                {currentCard.meanings?.join(", ") || "—"}
              </div>

              {/* JLPT / Strokes */}
              <div className="text-xs text-gray-500 mb-2">
                JLPT: {currentCard.jlpt ?? "-"} &nbsp;|&nbsp; Strokes: {currentCard.stroke_count}
              </div>

              {/* Readings */}
              <div className="text-xs space-y-1 mb-2">
                <div
                  onClick={() =>
                    speak((currentCard.kun_reading ?? []).map((r) => r.value).join(", "))
                  }
                >
                  <strong>Kun:</strong>{" "}
                  {(currentCard.kun_reading ?? []).map((r) => r.value).join(", ") || "—"}
                </div>
                <div
                  onClick={() =>
                    speak((currentCard.on_reading ?? []).map((r) => r.value).join(", "))
                  }
                >
                  <strong>On:</strong>{" "}
                  {(currentCard.on_reading ?? []).map((r) => r.value).join(", ") || "—"}
                </div>
              </div>

              {/* Words */}
              <div className="text-left text-xs">
                <strong>Words:</strong>
                <ul className="list-disc list-inside">
                  {(currentCard.word ?? []).slice(0, 3).map((w, i) => (
                    <li key={i}>{(w.meanings ?? []).join("; ")}</li>
                  ))}
                </ul>
              </div>

              {/* JPDB Link */}
              <Button asChild variant="ghost" size="sm" className="text-xs mt-3">
                <a
                  href={`https://jpdb.io/kanji/${encodeURIComponent(currentCard.kanji)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on JPDB →
                </a>
              </Button>
            </div>
          ) : (
            // 🀄️ Front side — big Kanji only
            <div
              className="text-6xl sm:text-7xl mt-20 cursor-pointer"
              onClick={() => speak(currentCard.kanji)}
            >
              {currentCard.kanji}
            </div>
          )}
        </motion.div>
      )}

      {/* 🔁 Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={prev} disabled={!canGoBack} variant="outline">
          Previous
        </Button>
        <Button onClick={next} disabled={!canGoForward}>
          Next
        </Button>
      </div>

      {loading && <p className="text-xs text-gray-500 mt-2">Loading...</p>}
    </div>
  );
}
