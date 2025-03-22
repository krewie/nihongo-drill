import { useSlidingKanjiDeck } from "@/hooks/useSlidingDeck";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function FlashCardDeck({ jlpt }: { jlpt: number }) {
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
  } = useSlidingKanjiDeck({ chunkSize: 20, windowSize: 60, jlpt });

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
          className="relative border rounded-2xl p-6 text-center shadow-md w-full max-w-xs h-[36rem] mt-6 perspective"
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
        >
          {/* 🔘 Top button row */}
          <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center px-2">
            <Button variant="outline" size="icon" onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={() => setFlipped(!flipped)}>
              Flip Card
            </Button>

            <Button variant="outline" size="sm" onClick={toggleRate}>
              {rate}
            </Button>
          </div>

          {/* 🔄 Animated flip container */}
          <div className="relative w-full h-full mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "back" : "front"}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full backface-hidden"
              >
                {flipped ? (
                  <div className="overflow-auto px-2 text-left text-sm">
                    <div
                      className="text-6xl sm:text-9xl text-center cursor-pointer mb-4"
                      onClick={() => speak(currentCard.kanji)}
                    >
                      {currentCard.kanji}
                    </div>

                    <div className="font-medium mb-1">
                      {currentCard.meanings?.join(", ") || "—"}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      JLPT: {currentCard.jlpt ?? "-"} | Strokes: {currentCard.stroke_count}
                    </div>

                    <div className="space-y-1 mb-2">
                      <div onClick={() => speak((currentCard.kun_reading ?? []).map((r) => r.value).join(", "))}>
                        <strong>Kun:</strong> {(currentCard.kun_reading ?? []).map((r) => r.value).join(", ") || "—"}
                      </div>
                      <div onClick={() => speak((currentCard.on_reading ?? []).map((r) => r.value).join(", "))}>
                        <strong>On:</strong> {(currentCard.on_reading ?? []).map((r) => r.value).join(", ") || "—"}
                      </div>
                    </div>

                    <div>
                      <strong>Words:</strong>
                      <ul className="list-disc list-inside">
                        {(currentCard.word ?? []).slice(0, 3).map((w, i) => (
                          <li key={i}>{(w.meanings ?? []).join("; ")}</li>
                        ))}
                      </ul>
                    </div>

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
                  <div
                    className="flex items-center justify-center h-full w-full text-6xl sm:text-9xl cursor-pointer"
                    onClick={() => speak(currentCard.kanji)}
                  >
                    {currentCard.kanji}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

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
