'use client';

import { Minus, Plus } from 'lucide-react';
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

const STEPPER_BUTTON_CLASS = mergeClassNames(
  'flex h-10 w-10 shrink-0 items-center justify-center',
  'rounded-lg border border-gray-300 bg-white',
  'text-gray-600',
  'transition-all duration-150 ease-out',
  'hover:bg-gray-50 hover:text-gray-900',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
);

/** Number input with custom increment/decrement buttons */
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
    'w-full rounded-lg border py-2.5 text-center',
    'text-sm font-medium text-gray-900',
    'transition-all duration-150 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500',
    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-indigo-500',
  );

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrement}
        aria-label="Smanji iznos"
        className={STEPPER_BUTTON_CLASS}
      >
        <Minus className={ICON_SIZE} />
      </button>
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
      <button
        type="button"
        onClick={handleIncrement}
        aria-label="Povećaj iznos"
        className={STEPPER_BUTTON_CLASS}
      >
        <Plus className={ICON_SIZE} />
      </button>
    </div>
  );
}
