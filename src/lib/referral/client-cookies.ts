/**
 * Referral Cookie Management (Client-Side)
 * Securely capture and store referral codes using first-party cookies
 * 
 * SECURITY NOTES:
 * - Only runs in browser (use 'use client' in React components)
 * - Cookies are first-party, domain-specific
 * - No sensitive data stored; only referral code
 * - Automatic cleanup after signup or expiry
 * - SameSite=Lax for CSRF protection
 */

const COOKIE_NAME = 'ami_referral_code';
const COOKIE_EXPIRY_DAYS = 30; // 30-day cookie validity
const MAX_CODE_LENGTH = 8;

/**
 * Extract referral code from URL query parameters
 * Safely parses ?ref=CODE or ?referral=CODE
 *
 * @returns Referral code if found and valid, null otherwise
 */
export function getCaptureCodeFromUrl(): string | null {
  // Only run in browser
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check both ?ref= and ?referral= parameters
    let code = searchParams.get('ref') || searchParams.get('referral');
    
    if (!code) {
      return null;
    }

    // Normalize: uppercase, trim, basic validation
    code = code.toUpperCase().trim();

    // Validate format: 6-8 alphanumeric characters
    if (!/^[A-Z0-9]{6,8}$/.test(code)) {
      console.warn('[getCaptureCodeFromUrl] Invalid code format:', code);
      return null;
    }

    return code;
  } catch (err) {
    console.warn('[getCaptureCodeFromUrl] Error:', err);
    return null;
  }
}

/**
 * Store referral code in first-party cookie
 * Called when user lands on signup/register page with ?ref=CODE
 *
 * @param code - Referral code to store
 * @param expiryDays - Cookie expiry in days (default 30)
 * @returns True if successfully stored
 */
export function storeReferralCodeCookie(
  code: string,
  expiryDays: number = COOKIE_EXPIRY_DAYS
): boolean {
  // Only run in browser
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    // Validate code format
    const normalizedCode = code.toUpperCase().trim();
    if (!/^[A-Z0-9]{6,8}$/.test(normalizedCode)) {
      console.warn('[storeReferralCodeCookie] Invalid code format');
      return false;
    }

    // Calculate expiry date
    const date = new Date();
    date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;

    // Set secure cookie
    // SameSite=Lax: Allows cookie on top-level navigation (signup links)
    // Secure: Only sent over HTTPS in production
    const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
    document.cookie = `${COOKIE_NAME}=${normalizedCode};${expires};Path=/;SameSite=Lax;${secure}`;

    return true;
  } catch (err) {
    console.warn('[storeReferralCodeCookie] Error:', err);
    return false;
  }
}

/**
 * Retrieve referral code from cookie
 * Called during signup to attach code to new account
 *
 * @returns Referral code if found, null otherwise
 */
export function getReferralCodeFromCookie(): string | null {
  // Only run in browser
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const name = `${COOKIE_NAME}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        const code = cookie.substring(name.length);
        
        // Validate retrieved code
        if (!/^[A-Z0-9]{6,8}$/.test(code)) {
          console.warn('[getReferralCodeFromCookie] Invalid stored code');
          return null;
        }

        return code;
      }
    }

    return null;
  } catch (err) {
    console.warn('[getReferralCodeFromCookie] Error:', err);
    return null;
  }
}

/**
 * Clear referral code cookie (cleanup after signup)
 * Called after successful referral attribution
 *
 * @returns True if successfully cleared
 */
export function clearReferralCodeCookie(): boolean {
  // Only run in browser
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    // Set expiry to past date to delete
    document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;Path=/;`;
    return true;
  } catch (err) {
    console.warn('[clearReferralCodeCookie] Error:', err);
    return false;
  }
}

/**
 * Capture referral code from URL and store in cookie
 * Call this on landing pages (signup, register, etc.)
 * Idempotent — safe to call multiple times
 *
 * @returns Stored code if found and saved, null otherwise
 */
export function captureAndStoreReferralCode(): string | null {
  try {
    // Check if code already stored in cookie
    const existingCode = getReferralCodeFromCookie();
    if (existingCode) {
      return existingCode; // Already stored
    }

    // Try to capture from URL
    const urlCode = getCaptureCodeFromUrl();
    if (!urlCode) {
      return null; // No referral code in URL
    }

    // Store in cookie
    const stored = storeReferralCodeCookie(urlCode);
    return stored ? urlCode : null;
  } catch (err) {
    console.warn('[captureAndStoreReferralCode] Error:', err);
    return null;
  }
}

/**
 * Generate a public referral link for sharing
 * @param baseUrl - Base URL of app (e.g., 'https://amibykoko.com')
 * @param code - Referral code
 * @param campaign - Optional campaign identifier for tracking
 * @returns Full referral URL
 */
export function generateReferralLink(
  baseUrl: string,
  code: string,
  campaign?: string
): string {
  try {
    const url = new URL(`${baseUrl}/auth/signup`);
    url.searchParams.set('ref', code);
    
    if (campaign) {
      url.searchParams.set('campaign', campaign);
    }

    return url.toString();
  } catch (err) {
    console.warn('[generateReferralLink] Error:', err);
    return `${baseUrl}/auth/signup?ref=${code}`;
  }
}

/**
 * Get referral link for current user (if code available)
 * Used in referral dashboard
 * @param code - User's referral code
 * @returns Full referral URL
 */
export function getCurrentReferralLink(code: string): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  return generateReferralLink(baseUrl, code);
}

/**
 * Copy referral link to clipboard
 * @param link - URL to copy
 * @returns Promise that resolves when copied
 */
export async function copyReferralLinkToClipboard(link: string): Promise<boolean> {
  // Only run in browser with clipboard API
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch (err) {
    console.warn('[copyReferralLinkToClipboard] Error:', err);
    return false;
  }
}

/**
 * Check if referral code is stored in cookie
 * @returns True if cookie contains valid code
 */
export function hasReferralCode(): boolean {
  const code = getReferralCodeFromCookie();
  return code !== null;
}

/**
 * Generate share URLs for social platforms
 * @param referralLink - Full referral link
 * @param message - Custom message (optional)
 * @returns Object with share URLs for each platform
 */
export function getShareUrls(
  referralLink: string,
  message: string = 'Join me on Àmì by Kòkò and learn phonics together!'
) {
  try {
    const encodedLink = encodeURIComponent(referralLink);
    const encodedMsg = encodeURIComponent(message);

    return {
      whatsapp: `https://wa.me/?text=${encodedMsg}%20${encodedLink}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMsg}&url=${encodedLink}`,
      email: `mailto:?subject=Àmì%20by%20Kòkò&body=${encodedMsg}%20${encodedLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
    };
  } catch (err) {
    console.warn('[getShareUrls] Error:', err);
    return {
      whatsapp: '',
      twitter: '',
      email: '',
      facebook: '',
    };
  }
}
