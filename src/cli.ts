#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import { program } from 'commander';

import {
  shortenURL,
  apiIsLive,
  shortIdentifierIsValid,
  longUrlIsValid,
} from './index';

const log = console.log;

/**
 *
 * @returns
 */
async function main() {
  // Initialize and register options
  log(chalk.bold.bgBlue('1pt.one CLI'));
  registerCommanderOptions();

  // Parse arguments
  program.parse(process.argv);
  const options = program.opts();
  let { help, status, longUrl, shortIdentifier } = options;

  // Help option: show arguments
  if (help) {
    program.help();
  }

  // Status option: check API status
  if (status) {
    if (await apiIsLive()) {
      outputMessage('API is up and running!', 'success');
    } else {
      outputMessage('API is down :(', 'error');
    }
    return;
  }

  // Long url not provided: ask interactively
  if (!longUrl) {
    ({ longUrl, shortIdentifier } = await askURL());
  }

  // Validate long url
  if (longUrl && !longUrlIsValid(longUrl)) {
    outputMessage('Invalid long URL', 'error');
  }

  // Shorten URL
  try {
    await shortenURL(longUrl, shortIdentifier);
  } catch (error: any) {
    outputMessage(error.message, 'error');
  }
}

main();

/**
 *
 */
function registerCommanderOptions() {
  program
    .version('0.0.1')
    .option('-l, --longUrl <longUrl>', 'Long URL to shorten')
    .option('-s, --shortIdentifier <shortId>', 'Short identifier to use')
    .option('-h, --help', 'Show help')
    .option('-v, --version', 'Show version number')
    .option('-S, --status', 'Show API status')
    .option(
      '-r, --retrieve',
      'Retrieve long URL from short URL as well as some basic information and statistics about it.'
    );
}

/**
 *
 * @returns
 */
async function askURL() {
  log(chalk.bold('No arguments provided. Please follow the instructions:'));

  const questions = [
    {
      name: 'longUrl',
      type: 'input',
      message: 'Enter the long url you want to shorten:',
    },
    {
      name: 'shortIdentifier',
      type: 'input',
      message: 'Enter the short version of the url:',
    },
  ];

  const { longUrl, shortIdentifier } = await inquirer.prompt(questions);
  return { longUrl, shortIdentifier };
}

/**
 *
 * @param msg
 * @param type
 */
function outputMessage(msg: string, type: string | undefined = undefined) {
  if (type === 'success') log(chalk.green(msg));
  else if (type === 'error') log(chalk.red(msg));
  else log(chalk.blue(msg));
}
