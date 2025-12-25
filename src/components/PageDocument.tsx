import { useMemo } from "react";
import type { JPBookData } from "@/models/book";

type BookReaderProps = { data: JPBookData };

export default function DocumentReader({ data }: BookReaderProps) {
  const book = useMemo(() => data, [data]);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      {book.chapters.map((chapter, chapterIndex) => (
        <section key={chapterIndex} style={{ marginBottom: "4rem" }}>
          {chapter.title && (
            <h2
              style={{
                fontStyle: "oblique",
                fontSize: "2.4rem",
                fontWeight: 600,
                marginBottom: "2rem",
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
                <hr style={{ border: "none", borderTop: "1px solid #444", margin: "4rem 0" }} />
            </article>
            ))}

        </section>
      ))}
    </main>
  );
}

