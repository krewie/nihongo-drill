import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import type { JPBookData, JPPage } from "@/models/book";

/** Utility types */
interface FlatPage extends JPPage {
  chapterId: string;
  chapterTitle: string;
  index: number;
}

function flattenBook(data: JPBookData): FlatPage[] {
  const out: FlatPage[] = [];
  let i = 0;
  for (const ch of data.chapters) {
    for (const p of ch.pages) {
      out.push({ ...p, chapterId: ch.id, chapterTitle: ch.title, index: i++ });
    }
  }
  return out;
}

const demoData: JPBookData = {
  title: "",
  author: "",
  chapters: [{ id: "", title: "", pages: [] }],
};

export default function JapaneseBook({
  data = demoData,
  verticalDefault = true,
}: {
  data?: JPBookData;
  verticalDefault?: boolean;
}) {
  const allPages = useMemo(() => flattenBook(data), [data]);

  const [doublePage, setDoublePage] = useState(true);

  const maxIndex = useMemo(() => {
    if (allPages.length === 0) return 0;
    return doublePage
      ? allPages.length % 2 === 0
        ? allPages.length - 2
        : allPages.length - 1 // last RIGHT page (even)
      : allPages.length - 1; // last page
  }, [allPages.length, doublePage]);

  // Normalizer: only snap to even when in double-page mode
  const normalizeIndex = useCallback(
    (i: number) => {
      let idx = Math.max(0, Math.min(i, maxIndex)); // clamp
      if (doublePage) idx = idx % 2 === 0 ? idx : idx - 1; // keep right page even
      return idx;
    },
    [maxIndex, doublePage]
  );

  // state
  const [rightPageIdx, setRightPageIdx] = useState(0);
  const [showFurigana, setShowFurigana] = useState(true);
  const [vertical, setVertical] = useState(verticalDefault);
  const [fontPx, setFontPx] = useState(20);

  // Fullscreen sizing states
  const rootRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [pageH, setPageH] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  // keep index valid whenever page count or mode changes
  useEffect(() => {
    setRightPageIdx((i) => normalizeIndex(i));
  }, [normalizeIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSpread();
      else if (e.key === "ArrowLeft") prevSpread();
      else if (e.key === "+" || e.key === "=")
        setFontPx((n) => Math.min(30, n + 2));
      else if (e.key === "-") setFontPx((n) => Math.max(14, n - 2));
      else if (e.key === "Home") setRightPageIdx(0);
      else if (e.key === "End") setRightPageIdx(maxIndex);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maxIndex]);

  function prevSpread() {
    setRightPageIdx((i) => normalizeIndex(i - (doublePage ? 2 : 1)));
  }
  function nextSpread() {
    setRightPageIdx((i) => normalizeIndex(i + (doublePage ? 2 : 1)));
  }

  const right = allPages[rightPageIdx];
  const left = allPages[rightPageIdx + 1];

  const pageStyleWriting: React.CSSProperties = vertical
    ? {
        writingMode: "vertical-rl",
        textOrientation: "upright",
        lineHeight: 1.9,
        letterSpacing: "0.05em",
      }
    : {
        writingMode: "horizontal-tb",
        textOrientation: "mixed",
        lineHeight: 1.9,
        letterSpacing: "0.02em",
      };

  // NOTE: we removed the fixed w-[360px] h-[540px]
  const pageChromeClass =
    "rounded-2xl shadow border border-neutral-200 overflow-hidden " +
    "dark:border-neutral-700 dark:bg-neutral-900";

  const pageInner: React.CSSProperties = {
    fontFamily:
      "'Noto Serif JP','Hiragino Mincho ProN','Yu Mincho','YuMincho','Source Han Serif JP',serif",
    fontSize: `${fontPx}px`,
    width: "100%",
    height: "100%",
    padding: vertical ? "8px" : "8px 12px",
    wordBreak: vertical ? ("normal" as const) : ("keep-all" as const),
  };

  const bookSpreadClass = "flex flex-row-reverse gap-4 items-stretch";

  const labelOf = (p?: FlatPage) => p?.label ?? (p ? p.index + 1 : "");

  const progress =
    allPages.length > 0
      ? ((rightPageIdx + 1) / allPages.length) * 100
      : 0;

  // 1) New: manual recalculation function (replaces useLayoutEffect body)
const recalcLayout = useCallback(() => {
  const vh = (window as any).visualViewport?.height ?? window.innerHeight;
  const toolbar = toolbarRef.current?.offsetHeight ?? 0;
  const paddingY = 24; // vertical padding inside the canvas wrapper
  const availableH = Math.max(0, vh - toolbar - paddingY);
  setPageH(availableH);

  // aspect 2:3 -> width = H * 2/3
  const pageW = (availableH * 2) / 3;
  const gap = 16; // Tailwind gap-4
  const pages = doublePage ? 2 : 1;
  const desiredW = pages * pageW + (doublePage ? gap : 0);

  const containerW = rootRef.current?.clientWidth ?? window.innerWidth;
  const horizontalPadding = 32; // px from px-4 on wrapper (left+right ~ 16+16)
  const availableW = Math.max(0, containerW - horizontalPadding);

  setScale(Math.min(1, availableW / desiredW));
}, [doublePage]);

// 2) Optional: set an initial layout once on mount
useEffect(() => {
  recalcLayout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  return (
    <div
      ref={rootRef}
      className="h-dvh w-screen overflow-hidden flex flex-col bg-background"
    >
      {/* Toolbar */}
      <div ref={toolbarRef} className="top-0 border-b border-indigo-700">
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              {data.title}
            </h1>
            {data.author && (
              <span className="text-sm text-neutral-600">{data.author}</span>
            )}
            <span className="text-sm text-neutral-600">
              {vertical ? "縦書き" : "横書き"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDoublePage((v) => !v)}
              className="
                px-3 py-1 rounded-lg border hover:shadow-sm
                border-neutral-300 dark:border-neutral-700
                bg-white dark:bg-neutral-900
                text-neutral-900 dark:text-neutral-100
                hover:bg-neutral-50 dark:hover:bg-neutral-800
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400
              "
              title={doublePage ? "切替: 単ページ" : "切替: 見開き"}
            >
              {doublePage ? "1" : "2"}
            </button>

            <button
              className="px-3 py-1 rounded-lg border hover:shadow-sm dark:border-neutral-700
                          bg-white dark:bg-neutral-900
                          text-neutral-500"
              onClick={() => setVertical((v) => !v)}
            >
              {vertical ? "横書きにする" : "縦書きにする"}
            </button>

            <button
              onClick={recalcLayout}
              className="px-3 py-1 rounded-lg border hover:shadow-sm
                        border-neutral-300 dark:border-neutral-700
                        bg-white dark:bg-neutral-900
                        text-neutral-900 dark:text-neutral-100"
              title="recalc"
            >
              Fit viewport
            </button>

            <button
              className="px-3 py-1 rounded-lg border hover:shadow-sm dark:border-neutral-700
                          bg-white dark:bg-neutral-900
                          text-neutral-500"
              onClick={() => setShowFurigana((s) => !s)}
            >
              {showFurigana ? "ふりがな非表示" : "ふりがな表示"}
            </button>

            <div className="flex items-center gap-1">
              <button
                className="px-2 py-1 rounded-lg border hover:shadow-sm dark:border-neutral-700
                           bg-white dark:bg-neutral-900"
                onClick={() => setFontPx((n) => Math.max(14, n - 2))}
              >
                −
              </button>
              <span className="min-w-10 text-center tabular-nums">
                {fontPx}px
              </span>
              <button
                className="px-2 py-1 rounded-lg border hover:shadow-sm dark:border-neutral-700
                           bg-white dark:bg-neutral-900"
                onClick={() => setFontPx((n) => Math.min(32, n + 2))}
              >
                ＋
              </button>
            </div>
          </div>
        </div>
        <div className="h-1">
          <div
            className="h-full bg-indigo-900"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Book canvas */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-3 flex items-start justify-center">
          {/* Scale whole spread if double page doesn't fit horizontally */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <div className={bookSpreadClass}>
              {/* RIGHT page */}
              <article
                className={pageChromeClass}
                style={{
                  height: pageH,
                  width: (pageH * 2) / 3, // keep 2:3 aspect
                }}
              >
                <header className="text-xs text-neutral-500 dark:text-neutral-400 px-3 py-2 flex items-center justify-between">
                  <span>{right?.chapterTitle}</span>
                  {right && <span>p.{labelOf(right)}</span>}
                </header>
                {/* subtract header height (~40px) so content fills remaining */}
                <div style={pageStyleWriting} className="h-[calc(100%-40px)]">
                  <div
                    style={pageInner}
                    className={showFurigana ? "" : "[&_rt]:hidden"}
                    dangerouslySetInnerHTML={{ __html: right?.html ?? "" }}
                  />
                </div>
              </article>

              {/* LEFT page */}
              {doublePage && left && (
                <article
                  className={pageChromeClass}
                  style={{
                    height: pageH,
                    width: (pageH * 2) / 3,
                  }}
                >
                  <header className="text-xs text-neutral-500 dark:text-neutral-400 px-3 py-2 flex items-center justify-between">
                    <span>{left?.chapterTitle ?? ""}</span>
                    {left && <span>p.{labelOf(left)}</span>}
                  </header>
                  <div
                    style={pageStyleWriting}
                    className="h-[calc(100%-40px)]"
                  >
                    <div
                      style={pageInner}
                      className={showFurigana ? "" : "[&_rt]:hidden"}
                      dangerouslySetInnerHTML={{ __html: left?.html ?? "" }}
                    />
                  </div>
                </article>
              )}
            </div>

            {/* Pager controls */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={prevSpread}
                className="
                  px-4 py-2 rounded-xl shadow-sm
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-900 dark:text-neutral-100
                  hover:bg-neutral-50 dark:hover:bg-neutral-800
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400
                "
                disabled={rightPageIdx <= 0}
                title="前の見開き"
              >
                ← 前へ
              </button>

              <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <span>ページ:</span>
                <PageJump
                  value={rightPageIdx + 1}
                  max={allPages.length}
                  onJump={(oneBased) =>
                    setRightPageIdx(normalizeIndex(oneBased - 1))
                  }
                />
                <span className="opacity-70">/ {allPages.length}</span>
              </div>

              <button
                onClick={nextSpread}
                className="
                  px-4 py-2 rounded-xl shadow-sm
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  text-neutral-900 dark:text-neutral-100
                  hover:bg-neutral-50 dark:hover:bg-neutral-800
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400
                "
                disabled={rightPageIdx >= maxIndex}
                title="次の見開き"
              >
                次へ →
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-neutral-500">
              ヒント: ←/→ でページ送り、Home/End で先頭/末尾、+/- で文字サイズ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


function PageJump({
  value,
  max,
  onJump,
}: {
  value: number;
  max: number;
  onJump: (n: number) => void;
}) {
  const [local, setLocal] = useState(String(value));
  useEffect(() => setLocal(String(value)), [value]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const n = Math.max(1, Math.min(parseInt(local || "1", 10), max));
        onJump(n);
      }}
      className="flex items-center gap-2"
    >
      <input
        className="w-16 px-2 py-1 rounded-md text-center shadow-inner
          border border-neutral-300 dark:border-neutral-700
          bg-white dark:bg-neutral-900
          text-neutral-900 dark:text-neutral-100 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
        value={local}
        onChange={(e) =>
          setLocal(e.target.value.replace(/[^0-9]/g, ""))
        }
        inputMode="numeric"
      />
      <button
        className="px-3 py-1 rounded-md border hover:shadow-sm
          dark:border-neutral-700
          bg-white dark:bg-neutral-900
          text-neutral-500"
        type="submit"
      >
        移動
      </button>
    </form>
  );
}
