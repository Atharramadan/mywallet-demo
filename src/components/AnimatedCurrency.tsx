import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { formatCurrency } from '../lib/formatters';

interface AnimatedCurrencyProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCurrency({ value, duration, className }: AnimatedCurrencyProps) {
  const animatedValue = useAnimatedNumber(value, duration);
  
  return (
    <span className={className}>
      {formatCurrency(animatedValue)}
    </span>
  );
}
