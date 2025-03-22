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
}

export function useSlidingKanjiDeck({
  chunkSize = 20,
  windowSize = 60,
}: UseSlidingKanjiDeckConfig = {}) {
  const [kanjiList, setKanjiList] = useState<KanjiCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    const from = page * chunkSize;
    const to = from + chunkSize - 1;

    const query = supabase
      .from("kanji")
      .select(
        `kanji, meanings, stroke_count, jlpt,
         kun_reading(value),
         on_reading(value),
         word(meanings)`
      )
      .not("jlpt", "is", null)
      .range(from, to);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase fetch error:", error);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setKanjiList((prev) => {
        const merged = [...prev, ...data];
        return merged.slice(-windowSize); // sliding window
      });
      setCurrentPage(page);
    }
    setLoading(false);
  }, [chunkSize, windowSize]);

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
