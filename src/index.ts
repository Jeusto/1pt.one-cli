#!/usr/bin/env node
import { askURL, checkApiStatus, shortenURL, retrieveInfo } from './cli.js';
import { program } from 'commander';
import chalk from 'chalk';

/**
 * Entry point of the CLI
 */
(async () => {
  // Initialize and register options
  console.log(chalk.bold.bgBlue('1.1 CLI'));
  registerCommanderOptions();

  // Parse arguments
  program.parse(process.argv);
  const options = program.opts();
  const { help, status, info } = options;
  let { longUrl, shortIdentifier } = options;

  // Call different views depending on the options
  if (help) program.help();
  else if (status) checkApiStatus();
  else if (info) retrieveInfo(info);
  // Long url and short id provided => shorten
  else if (longUrl && shortIdentifier) shortenURL(longUrl, shortIdentifier);
  // Only long url provided => shorten with random short id
  else if (longUrl && !shortIdentifier) shortenURL(longUrl, shortIdentifier);
  // Default => ask for long and short url
  else {
    ({ longUrl, shortIdentifier } = await askURL());
    await shortenURL(longUrl, shortIdentifier);
  }
})();

/**
 * Register CLI options and arguments with commander
 */
function registerCommanderOptions() {
  program
    .version('0.0.5')
    .option('-l, --longUrl <longUrl>', 'Long URL to shorten.')
    .option('-s, --shortIdentifier <shortId>', 'Short identifier to use.')
    .option('-h, --help', 'Show help.')
    .option('-S, --status', 'Show API status.')
    .option('-i, --info <url>', 'Retrieve some information and stats about a shortened URL.');
}
