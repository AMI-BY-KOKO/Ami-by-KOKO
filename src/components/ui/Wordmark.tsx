"use client";

/**
 * Wordmark component — renders "Àmì & Kòkò" branding
 * Àmì in coral (#F25C54), & in muted (#8A90AD), Kòkò in green (#1FA463)
 */

interface WordmarkProps {
  /** Optional className for wrapper div */
  className?: string;
  /** Font size scale: "sm" (16px), "base" (20px), "lg" (28px default) */
  size?: "sm" | "base" | "lg";
}

export default function Wordmark({ className = "", size = "lg" }: WordmarkProps) {
  const sizeMap = {
    sm: "text-base",
    base: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center justify-center gap-1 font-display font-bold ${sizeMap[size]} ${className}`}>
      <span className="text-coral">Àmì</span>
      <span className="text-navy-muted">&</span>
      <span className="text-cat-green">Kòkò</span>
    </div>
  );
}
