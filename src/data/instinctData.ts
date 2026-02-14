// instinctData.ts
export type InstinctItem = {
  id: string
  sentence: string
  answer: "did" | "happened"
  reason: string
  contrast: string
}

// loadCsv.ts
export async function loadInstinctData(): Promise<InstinctItem[]> {
  const res = await fetch("/instinct.csv")
  const text = await res.text()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_header, ...rows] = text.trim().split("\n")

  return rows.map(row => {
    const [sentence, answer, reason, contrast] = row.split(",")

    return {
      id: crypto.randomUUID(),
      sentence,
      answer: answer as "did" | "happened",
      reason,
      contrast,
    }
  })
}
