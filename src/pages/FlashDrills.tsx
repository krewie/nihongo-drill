import FlashCardDeck from "@/components/FlashCardDeck";

export default function FlashDrills({ jlpt }: { jlpt: number }) {
  return <FlashCardDeck jlpt={jlpt} />;
}
