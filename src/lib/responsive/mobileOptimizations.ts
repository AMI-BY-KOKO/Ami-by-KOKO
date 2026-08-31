/**
 * Mobile Optimization Constants
 * Breakpoints and touch-friendly measurements for responsive design
 */

export const BREAKPOINTS = {
  xs: 320,   // Small phones
  sm: 375,   // Regular phones (iPhone)
  md: 430,   // Large phones / small tablets
  lg: 768,   // Tablets
  xl: 1024,  // Desktop
  "2xl": 1440, // Large desktop
};

/**
 * Touch target sizes (minimum 48x48px for accessibility)
 */
export const TOUCH_TARGETS = {
  small: "h-10 w-10",     // 40px (min acceptable)
  default: "h-12 w-12",   // 48px (recommended)
  large: "h-14 w-14",     // 56px (comfortable)
  xl: "h-16 w-16",        // 64px (spacious)
};

/**
 * Responsive padding/spacing for mobile
 */
export const MOBILE_SPACING = {
  xs: "p-2",      // 8px
  sm: "p-3",      // 12px
  md: "p-4",      // 16px
  lg: "p-6",      // 24px
};

/**
 * Responsive gaps
 */
export const MOBILE_GAPS = {
  xs: "gap-2",    // 8px
  sm: "gap-3",    // 12px
  md: "gap-4",    // 16px
  lg: "gap-6",    // 24px
};

/**
 * Font sizes for mobile
 */
export const MOBILE_TEXT = {
  xs: "text-xs md:text-sm",
  sm: "text-sm md:text-base",
  base: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
  "2xl": "text-2xl md:text-3xl",
  "3xl": "text-3xl md:text-4xl",
  "4xl": "text-4xl md:text-5xl",
};

/**
 * Responsive grid columns
 */
export const MOBILE_GRID = {
  cols1: "grid-cols-1",
  cols2: "grid-cols-2 md:grid-cols-3",
  cols3: "grid-cols-3 md:grid-cols-4",
  cols4: "grid-cols-4 md:grid-cols-5",
};

/**
 * Safe area padding (for notches and safe zones)
 */
export const SAFE_AREA = {
  top: "pt-safe",
  bottom: "pb-safe",
  horizontal: "px-safe",
};

/**
 * Mobile-friendly button heights
 */
export const BUTTON_HEIGHTS = {
  sm: "py-2 px-4",      // Small
  md: "py-3 px-6",      // Medium (default)
  lg: "py-4 px-8",      // Large
  xl: "py-5 px-10",     // Extra large
};

/**
 * Get responsive margin class
 */
export function getResponsiveMargin(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  if (!tablet && !desktop) return mobile;
  if (tablet && !desktop) return `${mobile} md:${tablet}`;
  return `${mobile} md:${tablet} lg:${desktop}`;
}

/**
 * Check if viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < BREAKPOINTS.lg;
}

/**
 * Check if viewport is small mobile
 */
export function isSmallMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < BREAKPOINTS.sm;
}

/**
 * Get appropriate column count for responsive grid
 */
export function getResponsiveColumns(itemCount: number): string {
  if (itemCount <= 2) return "grid-cols-2 md:grid-cols-2";
  if (itemCount <= 3) return "grid-cols-3 md:grid-cols-3";
  if (itemCount <= 4) return "grid-cols-2 md:grid-cols-4";
  return "grid-cols-2 md:grid-cols-4 lg:grid-cols-5";
}
