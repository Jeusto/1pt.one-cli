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
