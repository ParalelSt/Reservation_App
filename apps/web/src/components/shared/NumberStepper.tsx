'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

interface Props {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  step: number;
  placeholder?: string;
  hasError?: boolean;
  label: string;
}

const ICON_SIZE = 'h-4 w-4';

/** Number input with custom increment/decrement arrow buttons */
export function NumberStepper({ id, value, onChange, min, step, placeholder, hasError, label }: Props) {
  const handleIncrement = () => {
    const next = value === 0 ? min : value + step;
    onChange(parseFloat(next.toFixed(2)));
  };

  const handleDecrement = () => {
    const next = value - step;
    const clamped = next < min ? min : next;
    onChange(parseFloat(clamped.toFixed(2)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value) || 0);
  };

  const inputClassName = mergeClassNames(
    'w-full rounded-lg border py-2.5 pl-4 pr-12',
    'text-sm text-gray-900',
    'transition-all duration-150 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500',
    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-indigo-500',
  );

  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        min={min}
        step={step}
        value={value || ''}
        onChange={handleInputChange}
        placeholder={placeholder}
        aria-label={label}
        className={inputClassName}
      />
      <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
        <button
          type="button"
          onClick={handleIncrement}
          aria-label="Povećaj iznos"
          className={mergeClassNames(
            'flex flex-1 items-center justify-center px-2',
            'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
            'rounded-tr-lg',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
          )}
        >
          <ChevronUp className={ICON_SIZE} />
        </button>
        <div className="border-t border-gray-300" />
        <button
          type="button"
          onClick={handleDecrement}
          aria-label="Smanji iznos"
          className={mergeClassNames(
            'flex flex-1 items-center justify-center px-2',
            'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
            'rounded-br-lg',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
          )}
        >
          <ChevronDown className={ICON_SIZE} />
        </button>
      </div>
    </div>
  );
}
