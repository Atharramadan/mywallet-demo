import {
  Landmark, Wallet, UtensilsCrossed, Car, ShoppingBag, Receipt, HeartPulse,
  Clapperboard, GraduationCap, Briefcase, Laptop, PiggyBank, Gift, Ellipsis,
  Plane, Home, Dumbbell, Baby, PawPrint, Coffee, Smartphone, Shirt, Book,
  Fuel, Bus, Train, Bike, Building2, CreditCard, TrendingUp, Sparkles,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  landmark: Landmark,
  wallet: Wallet,
  'utensils-fork-knife': UtensilsCrossed,
  utensils: UtensilsCrossed,
  car: Car,
  'shopping-bag': ShoppingBag,
  receipt: Receipt,
  'heart-pulse': HeartPulse,
  clapperboard: Clapperboard,
  'graduation-cap': GraduationCap,
  briefcase: Briefcase,
  laptop: Laptop,
  'piggy-bank': PiggyBank,
  gift: Gift,
  ellipsis: Ellipsis,
  plane: Plane,
  home: Home,
  dumbbell: Dumbbell,
  baby: Baby,
  'paw-print': PawPrint,
  coffee: Coffee,
  smartphone: Smartphone,
  shirt: Shirt,
  book: Book,
  fuel: Fuel,
  bus: Bus,
  train: Train,
  bike: Bike,
  building: Building2,
  card: CreditCard,
  trending: TrendingUp,
  sparkles: Sparkles,
};

export const ICON_CHOICES = Object.keys(ICON_MAP);

export function AppIcon({
  name,
  size = 20,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const IconComponent = ICON_MAP[name] ?? Ellipsis;
  return <IconComponent size={size} className={className} style={style} strokeWidth={2} />;
}
