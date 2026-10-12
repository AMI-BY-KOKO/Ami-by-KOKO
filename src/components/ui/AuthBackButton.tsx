"use client";

/**
 * AuthBackButton — back arrow for auth pages
 * Calls router.back(), falls back to "/" if no history
 */

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface AuthBackButtonProps {
  /** Optional className */
  className?: string;
}

export default function AuthBackButton({ className = "" }: AuthBackButtonProps) {
  const router = useRouter();

  function handleBack() {
    // Try to go back; if no history, go to home
    router.back();
    // Fallback after a short delay (since router.back() is async)
    const timer = setTimeout(() => {
      router.push("/");
    }, 500);

    return () => clearTimeout(timer);
  }

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className={`flex items-center justify-center w-11 h-11 rounded-lg text-navy hover:bg-stone-50 transition focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 ${className}`}
    >
      <ArrowLeft size={24} strokeWidth={2} />
    </button>
  );
}
