export const API_URL = 'https://1pt.one';

/**
 * Checks if a long URL is valid
 * @param url
 * @returns
 */
export function longUrlIsValid(url: string) {
  if (!url) return false;

  return true;
}

/**
 * Checks if a short identifier is valid
 * @param url
 * @returns
 */
export function shortIdentifierIsValid(url: string) {
  if (!url || url.length < 3) return false;

  return true;
}
