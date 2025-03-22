import FlashCardDeck from "@/components/FlashCardDeck";

export default function FlashDrills({ jlpt }: { jlpt: number }) {
  return (
    <div className="flex flex-1 items-center justify-center pt-5 px-2">
      <FlashCardDeck jlpt={jlpt} />
    </div>
  );
}

