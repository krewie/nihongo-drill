// instinctData.ts
export type InstinctItem = {
  id: number
  sentence: string
  answer: "did" | "happened"
  reason: string
  contrast: string
}

// loadCsv.ts
export async function loadInstinctData() {
  const res = await fetch("../../../public/instinct.csv")
  const text = await res.text()

  const [header, ...rows] = text.trim().split("\n")

  return rows.map(row => {
    const [sentence, answer, reason, contrast] = row.split(",")
    return {
      sentence,
      answer: answer as "did" | "happened",
      reason,
      contrast,
    }
  })
}

