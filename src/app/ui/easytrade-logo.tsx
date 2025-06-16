// /easytrade-ui/src/app/ui/easytrade-logo.tsx
import { montserrat } from '@/app/ui/fonts'; // Assuming Montserrat for the logo font

interface EasyTradeLogoProps {
  size?: string; // e.g., "text-2xl", "text-4xl"
  className?: string; // For additional wrapper styling
}

export default function EasyTradeLogo({ size = "text-2xl", className = "" }: EasyTradeLogoProps) {
  return (
    <div className={`${montserrat.className} ${className} flex items-baseline leading-none`}>
      <span className={`font-extrabold text-easytrade-black ${size}`}>Easy</span>
      <span className={`font-semibold text-easytrade-blue ${size}`}>Trade</span>
    </div>
  );
}
