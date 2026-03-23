import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

export interface ChipButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

export function ChipButton({
  label,
  isSelected,
  onClick,
  isDisabled = false,
}: ChipButtonProps) {
  const chipClassName = mergeClassNames(
    'rounded-full px-4 py-1.5',
    'text-sm font-medium border',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-150 ease-out',
    isSelected
      ? 'bg-indigo-600 text-white border-indigo-600'
      : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300',
  );

  return (
    <button
      type="button"
      className={chipClassName}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={label}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
