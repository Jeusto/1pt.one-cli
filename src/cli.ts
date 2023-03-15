import { API_URL, longUrlIsValid, shortIdentifierIsValid } from './utils.js';
import { shorten, retrieve, apiIsLive } from './api.js';
import chalk, { ChalkInstance } from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import QRCode from 'qrcode';

const log = console.log;

/**
 * CLI view for shortening a URL and displaying the result
 * @param longURL
 * @param shortURL
 */
export async function shortenURL(longURL: string, shortURL: string) {
  const spinner = ora(`Shortening the URL "${chalk.red(longURL)}"`).start();

  try {
    const short = await shorten(longURL, shortURL);

    QRCode.toString(short, (err, url) => {
      if (err) throw err;
      log(chalk.white(url));
    });

    spinner.stop();

    log(chalk.bold('Original URL: '), chalk.underline.cyan(longURL));
    log(chalk.bold('Shortened URL: '), chalk.underline.cyan(short));
  } catch (error: any) {
    spinner.stop();
    outputMessage(`Error: ${error.message}`, 'error');
  }
}

/**
 * CLI view for retrieving information about a shortened URL
 * @param shortURL
 */
export async function retrieveInfo(shortURL: string) {
  if (!shortIdentifierIsValid(shortURL)) {
    outputMessage('Please provide a short URL', 'error');
    return;
  }

  const spinner = ora(`Retrieving information about "${chalk.red(shortURL)}"`).start();

  try {
    const info = await retrieve(shortURL);
    const short = `${API_URL}/${info.short_url}`;

    spinner.stop();

    log(chalk.bold('Original URL: '), chalk.underline.cyan(info.long_url));
    log(chalk.bold('Shortened URL: '), chalk.underline.cyan(short));
    log(chalk.bold('Created at: '), chalk.cyan(info.created_at));
    log(chalk.bold('Number of visits: '), chalk.cyan(info.number_of_visits));
  } catch (error: any) {
    spinner.stop();
    outputMessage(`Error: ${error.message}`, 'error');
  }

  process.exit(0);
}

/**
 * CLI view for checking the status of the API
 */
export async function checkApiStatus() {
  const spinner = ora('Checking API status').start();
  const isLive = await apiIsLive();
  spinner.stop();

  if (isLive) outputMessage('API is up and running!', 'success');
  else outputMessage('API is down :(', 'error');

  process.exit(0);
}

/**
 * Asks the user for a long URL and a short identifier
 * @returns
 */
export async function askURL() {
  outputMessage('No arguments provided. Please follow the instructions:');

  let longUrl, shortIdentifier;
  const questions = [
    {
      name: 'longUrl',
      type: 'input',
      message: 'Enter the long url you want to shorten:',
    },
    {
      name: 'shortIdentifier',
      type: 'input',
      message: 'Enter the short version of the url, hit enter to randomly generate one:',
    },
  ];

  while (!longUrlIsValid(longUrl)) {
    outputMessage('Invalid URL or short identifier. Please try again:', 'error');
    const res = await inquirer.prompt(questions);
    longUrl = res.longUrl;
    shortIdentifier = res.shortIdentifier;
  }

  return { longUrl, shortIdentifier };
}

/**
 * Outputs a message to the console
 * @param msg
 * @param type
 */
export function outputMessage(msg: string, type: string | undefined = undefined) {
  const type_color_map: { [key: string]: ChalkInstance } = {
    success: chalk.green,
    error: chalk.red,
  };

  if (type && type_color_map[type]) {
    log(type_color_map[type](msg));
  } else {
    log(chalk.white(msg));
  }
}
