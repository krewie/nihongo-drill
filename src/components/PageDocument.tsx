import { useMemo } from "react";
import type { JPBookData } from "@/models/book";

type BookReaderProps = { data: JPBookData };

export default function DocumentReader({ data }: BookReaderProps) {
  const book = useMemo(() => data, [data]);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      {book.chapters.map((chapter, chapterIndex) => (
        <section key={chapterIndex} style={{ marginBottom: "6rem" }}>

          {/* Chapter separator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "6rem 0 3rem",
            }}
          >
            <span style={{ color: "#aaa", whiteSpace: "nowrap" }}>
              第{chapterIndex + 1}章
            </span>

            <hr
              style={{
                flex: 1,
                border: "none",
                borderTop: "1px solid #370171ff",
              }}
            />
          </div>

          {chapter.title && (
            <h2
              style={{
                fontSize: "2.4rem",
                fontWeight: 600,
                marginBottom: "3rem",
              }}
            >
              {chapter.title}
            </h2>
          )}

          {chapter.pages.map((page, pageIndex) => (
            <article key={pageIndex}>
              <div
                dangerouslySetInnerHTML={{ __html: page.html }}
                style={{
                  fontSize: "2.0rem",
                  lineHeight: 2,
                  marginBottom: "3rem",
                }}
              />

              {/* Page separator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  margin: "4rem 0",
                }}
              >
                <span style={{ color: "#aaa", whiteSpace: "nowrap" }}>
                  ページ {pageIndex + 1}
                </span>

                <hr
                  style={{
                    flex: 1,
                    border: "none",
                    borderTop: "1px solid #444",
                  }}
                />
              </div>
            </article>
          ))}
        </section>
      ))}
    </main>
  );
}
