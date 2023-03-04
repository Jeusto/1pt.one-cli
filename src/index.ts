import chalk from 'chalk';
import ora from 'ora';
import fetch from 'node-fetch';
import QRCode from 'qrcode';

const log = console.log;

interface ShortenApiResponse {
  status: number;
  message: string;
  short_url: string;
  long_url: string;
}

interface RetrieveApiResponse {
  status: number;
  _id: number;
  short_url: string;
  long_url: URL;
  created_at: Date;
  number_of_visits: number;
}

/**
 *
 * @param longURL
 * @param shortURL
 */
export async function shortenURL(longURL: string, shortURL?: string) {
  const spinner = ora(`Shortening the URL "${chalk.red(longURL)}"`).start();

  const apiEndPoint = shortURL
    ? `https://1pt.one/shorten?short=${shortURL}&long=${longURL}`
    : `https://1pt.one/shorten?long=${longURL}`;

  const res = await fetch(apiEndPoint);
  const data = (await res.json()) as ShortenApiResponse;
  spinner.stop();

  if (res.status === 201) {
    const shortURL = `https://1pt.one/${data.short_url}`;

    QRCode.toString(shortURL, (err, url) => {
      if (err) throw err;
      log(chalk.white(url));
    });

    log(chalk.bold('Original URL: '), chalk.underline.cyan(data.long_url));
    log(chalk.bold('Shortened URL: '), chalk.underline.cyan(shortURL));
  } else if (res.status === 400) {
    throw new Error(data.message);
  } else {
    throw new Error('Unknown error');
  }
}

/**
 *
 * @param shortURL
 */
export async function retrieveShortenedUrlInfo(shortURL: string) {
  const spinner = ora(`Shortening the URL "${chalk.red(shortURL)}"`).start();

  const apiEndPoint = `https://1pt.one/retrieve?short=${shortURL}`;
  const res = await fetch(apiEndPoint);
  const data = (await res.json()) as RetrieveApiResponse | { message: string };

  spinner.stop();

  if (res.status === 200) {
    const info = data as RetrieveApiResponse;
    const shortURL = `https://1pt.one/${info.short_url}`;

    log(chalk.bold('Original URL: '), chalk.underline.cyan(info.long_url));
    log(chalk.bold('Shortened URL: '), chalk.underline.cyan(shortURL));
    log(chalk.bold('Created at: '), chalk.underline.cyan(info.created_at));
    log(
      chalk.bold('Number of visits: '),
      chalk.underline.cyan(info.number_of_visits)
    );
  } else if (res.status === 400) {
    let error = data as { message: string };
    throw new Error(error.message);
  } else {
    throw new Error('Unknown error');
  }
}

/**
 *
 * @param url
 * @returns
 */
export function longUrlIsValid(url: string) {
  return true;
}

/**
 *
 * @param url
 * @returns
 */
export function shortIdentifierIsValid(url: string) {
  return true;
}

/**
 *
 * @returns
 */
export async function apiIsLive() {
  const res = await fetch('https://1pt.one/status');
  return res.status == 200;
}
