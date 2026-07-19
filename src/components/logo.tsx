import { cn } from "../lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="96 96 320 320"
      fill="none"
      aria-hidden
      className={cn("h-8 w-8 shrink-0 text-primary", className)}
    >
      <line
        x1="148"
        y1="204"
        x2="364"
        y2="204"
        stroke="currentColor"
        strokeWidth="36"
        strokeLinecap="round"
      />
      <line
        x1="148"
        y1="308"
        x2="364"
        y2="308"
        stroke="currentColor"
        strokeWidth="36"
        strokeLinecap="round"
      />
      <line
        x1="372"
        y1="148"
        x2="140"
        y2="364"
        stroke="currentColor"
        strokeWidth="36"
        strokeLinecap="round"
      />
    </svg>
  );
}
