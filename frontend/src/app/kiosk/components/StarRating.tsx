'use client';
import { Star } from 'phosphor-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export default function StarRating({
  value,
  onChange,
  disabled,
}: StarRatingProps) {
  const [animIdx, setAnimIdx] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    if (disabled) return;
    onChange(idx + 1);
    setAnimIdx(idx);
    setTimeout(() => setAnimIdx(null), 200);
  };

  return (
    <div className="flex gap-4">
      {[0, 1, 2, 3, 4].map((idx) => {
        const isActive = idx < value;
        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => handleClick(idx)}
            className={`w-20 h-20 rounded-lg flex items-center justify-center transition border-2 focus:outline-none
              ${isActive ? 'bg-yellow-400 border-yellow-400' : 'bg-yellow-100 border-yellow-200 opacity-60'}
              ${animIdx === idx ? 'animate-pulse scale-110' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            <Star size={40} weight="fill" color="#fff" />
          </button>
        );
      })}
    </div>
  );
}
