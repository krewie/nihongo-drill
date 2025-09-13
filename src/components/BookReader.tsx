import { useMemo } from "react";
import JapaneseBook from "./JapaneaseBook";
import type { JPBookData } from "@/models/book";

type BookReaderProps = { data: JPBookData };

export default function BookReader({ data }: BookReaderProps) {
  const book = useMemo(() => data, [data]);
  return <JapaneseBook data={book} verticalDefault />;
}
