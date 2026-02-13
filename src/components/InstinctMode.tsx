// InstinctMode.tsx
import { useEffect, useState } from "react"
import { InstinctItem, loadInstinctData } from "../data/instinctData"

const ROUND_SIZE = 5

export default function InstinctMode() {
  const [round, setRound] = useState<InstinctItem[]>([])
  const [index, setIndex] = useState(0)
  const [instant, setInstant] = useState(0)
  const [hesitation, setHesitation] = useState(0)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [finished, setFinished] = useState(false)

  const [feedback, setFeedback] = useState<{
  correct: boolean
  reason: string
  contrast: string
} | null>(null)

const [items, setItems] = useState<InstinctItem[]>([])

useEffect(() => {
  loadInstinctData().then(setItems)
}, [])


  useEffect(() => {
    startNewRound()
  }, [])

  function startNewRound() {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    setRound(shuffled.slice(0, ROUND_SIZE))
    setIndex(0)
    setInstant(0)
    setHesitation(0)
    setFinished(false)
    setStartTime(Date.now())
  }

function answer(choice: "did" | "happened") {
  if (feedback) return

  const current = round[index]
  const elapsed = Date.now() - startTime
  const correct = choice === current.answer

  if (correct) {
    elapsed < 2000 ? setInstant(v => v + 1) : setHesitation(v => v + 1)
  } else {
    setHesitation(v => v + 1)
  }

  setFeedback({
    correct,
    reason: current.reason,
    contrast: current.contrast,
  })
}

function next() {
  setFeedback(null)

  if (index + 1 >= round.length) {
    setFinished(true)
  } else {
    setIndex(i => i + 1)
    setStartTime(Date.now())
  }
}



  // Keyboard support (important)
useEffect(() => {
  function onKey(e: KeyboardEvent) {
    if (finished) return

    if (feedback) {
      if (e.key === "Enter" || e.key === " ") {
        next()
      }
      return
    }

    if (e.key === "a") answer("did")
    if (e.key === "b") answer("happened")
  }

  window.addEventListener("keydown", onKey)
  return () => window.removeEventListener("keydown", onKey)
}, [feedback, index, finished])


  if (round.length === 0) return null

  if (finished) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Session complete</h2>
        <p>⚡ Instant: {instant}</p>
        <p>⏳ Hesitation: {hesitation}</p>
        <p>
          {instant > hesitation
            ? "You’re starting to treat actions vs events instinctively."
            : "Good exposure. Instinct is forming."}
        </p>
        <button onClick={startNewRound}>Another round</button>
      </div>
    )
  }

  return (
    <div style={{ marginTop:"2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem" }}>{round[index].sentence}</h1>
{feedback && (
  <div style={{ marginTop: 24 }}>
    <h2>{feedback.correct ? "✅ Correct" : "❌ Not quite"}</h2>
    <p>{feedback.reason}</p>
    <p style={{ marginTop:"2rem", opacity: 0.7 }}>
      Contrast:
    </p>
    <p style={{ fontSize: "3rem", opacity: 0.7 }}>
      {feedback.contrast}
    </p>

    <button onClick={next} style={{ marginTop: 16 }}>
      Next →
    </button>

    <p style={{ opacity: 0.5, marginTop: 8 }}>
      Enter / Space
    </p>
  </div>
)}


      <div style={{ marginTop: 32 }}>
        <button onClick={() => answer("did")}>
          A — 自分がやった
        </button>
        <button onClick={() => answer("happened")} style={{ marginLeft: 16 }}>
          B — 起きた
        </button>
      </div>

      <p style={{ marginTop: 24, opacity: 0.6 }}>
        A / B keys work
      </p>
    </div>
  )
}
