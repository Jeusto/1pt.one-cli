import { RetrieveApiResponse, ShortenApiResponse } from './types';
import { API_URL, longUrlIsValid } from './utils.js';
import fetch from 'node-fetch';

/**
 * Shortens a URL
 * @param longURL
 * @param shortURL
 * @returns The shortened URL
 * @throws Error
 */
export async function shorten(longURL: string, shortURL?: string) {
  if (!longUrlIsValid) throw new Error('Please provide a valid URL');

  const apiEndPoint = shortURL
    ? `${API_URL}/shorten?short=${shortURL}&long=${longURL}`
    : `${API_URL}/shorten?long=${longURL}`;

  const res = await fetch(apiEndPoint);
  const data = (await res.json()) as ShortenApiResponse;

  if (res.status === 201) {
    const shortURL = `${API_URL}/${data.short_url}`;
    return shortURL;
  } else if (res.status === 400) {
    throw new Error(data.message);
  } else {
    throw new Error('Unknown error');
  }
}

/**
 * Retrieves information about a shortened URL
 * @param shortURL
 * @returns Information about the shortened URL
 * @throws Error
 */
export async function retrieve(shortURL: string) {
  const apiEndPoint = `${API_URL}/retrieve?short=${shortURL}`;
  const res = await fetch(apiEndPoint);
  const data = (await res.json()) as RetrieveApiResponse | { message: string };

  if (res.status === 200) {
    const info = data as RetrieveApiResponse;
    return info;
  } else if (res.status === 400) {
    const error = data as { message: string };
    throw new Error(error.message);
  } else {
    throw new Error('Unknown error');
  }
}

/**
 * Checks if the API is live
 * @returns True if the API is live, false otherwise
 */
export async function apiIsLive() {
  const res = await fetch(`${API_URL}/status`);
  return res.status == 200;
}
