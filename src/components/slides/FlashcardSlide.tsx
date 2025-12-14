import { useState } from 'react';
import { BaseSlide, BaseSlideProps } from './BaseSlide';
import { RotateCw } from 'lucide-react';

export interface FlashcardSlideProps extends Omit<BaseSlideProps, 'children'> {
  title?: string;
  cards: Array<{
    front: string;
    back: string;
    icon?: string;
  }>;
  currentCard?: number;
}

export function FlashcardSlide({
  title,
  cards,
  currentCard = 0,
  ...baseProps
}: FlashcardSlideProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(currentCard);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setCardIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const card = cards[cardIndex];

  return (
    <BaseSlide {...baseProps} align="center" verticalAlign="center">
      {title && (
        <h1 
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: baseProps.palette?.primary }}
        >
          {title}
        </h1>
      )}
      <div className="relative w-full max-w-3xl mx-auto h-96 perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          onClick={handleFlip}
        >
          <div
            className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl p-12 flex flex-col items-center justify-center backface-hidden"
            style={{ backgroundColor: baseProps.palette?.background }}
          >
            {card.icon && (
              <div className="text-6xl mb-6">{card.icon}</div>
            )}
            <p className="text-4xl font-bold text-center">
              {card.front}
            </p>
            <div className="mt-8 flex items-center gap-2 opacity-60">
              <RotateCw className="w-5 h-5" />
              <span className="text-sm">Click to flip</span>
            </div>
          </div>
          <div
            className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl p-12 flex items-center justify-center backface-hidden [transform:rotateY(180deg)]"
            style={{ backgroundColor: baseProps.palette?.accent }}
          >
            <p className="text-3xl text-white text-center">
              {card.back}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          className="px-6 py-3 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow font-semibold"
          style={{ color: baseProps.palette?.primary }}
        >
          Previous
        </button>
        <span className="text-xl font-medium">
          {cardIndex + 1} / {cards.length}
        </span>
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow font-semibold"
          style={{ backgroundColor: baseProps.palette?.accent }}
        >
          Next
        </button>
      </div>
    </BaseSlide>
  );
}
