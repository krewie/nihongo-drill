import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

interface KanjiCard {
  kanji: string;
  meanings: string[];
  jlpt: string;
  stroke_count: number;
  kun_reading?: { value: string }[];
  on_reading?: { value: string }[];
  word?: { meanings: string[] }[];
}

interface UseSlidingKanjiDeckConfig {
  chunkSize?: number;
  windowSize?: number;
  jlpt?: number;
}

export function useSlidingKanjiDeck({
  chunkSize = 20,
  windowSize = 60,
  jlpt = 0,
}: UseSlidingKanjiDeckConfig = {}) {
  const [kanjiList, setKanjiList] = useState<KanjiCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(
    async (page: number) => {
      setLoading(true);
      const from = page * chunkSize;
      const to = from + chunkSize - 1;

      let query = supabase
      .from("kanji_with_kun_and_on")
      .select(`
        kanji, meanings, stroke_count, jlpt,
        kun_reading(value),
        on_reading(value),
        word(meanings)
      `)
      .range(from, to);
    

      // ✅ Only add .eq if jlpt is provided
      if (jlpt !== 0) {
        query = query.eq("jlpt", jlpt.toString());
      }

      // ✅ Always apply the range
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error("Supabase fetch error:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const filtered = data.filter((kanji: KanjiCard) => {
          return (
            kanji.kun_reading &&
            kanji.kun_reading.length > 0 &&
            kanji.on_reading &&
            kanji.on_reading.length > 0 &&
            kanji.word &&
            kanji.word.length > 0
          );
        });
      
        if (filtered.length > 0) {
          setKanjiList((prev) => {
            const merged = [...prev, ...filtered];
            return merged.slice(-windowSize);
          });
          setCurrentPage(page);
        }
      }
      
      setLoading(false);
    },
    [chunkSize, windowSize]
  );

  useEffect(() => {
    // Initial load
    fetchPage(0);
  }, [fetchPage]);

  const next = () => {
    setCurrentIndex((i) => {
      const nextIndex = i + 1;
      if (nextIndex >= kanjiList.length - 5) {
        fetchPage(currentPage + 1);
      }
      return Math.min(nextIndex, kanjiList.length - 1);
    });
  };

  const prev = () => {
    setCurrentIndex((i) => {
      const prevIndex = i - 1;
      if (prevIndex < 5 && currentPage > 0) {
        fetchPage(currentPage - 1);
      }
      return Math.max(0, prevIndex);
    });
  };

  return {
    currentCard: kanjiList[currentIndex],
    loading,
    next,
    prev,
    canGoBack: currentIndex > 0 || currentPage > 0,
    canGoForward: true, // technically always true unless you know total length
  };
}
