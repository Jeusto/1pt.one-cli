#!/usr/bin/env node
import { askURL, checkApiStatus, shortenURL, retrieveInfo } from './cli.js';
import { program } from 'commander';
import chalk from 'chalk';

/**
 * Entry point of the CLI
 */
(async () => {
  // Initialize and register options
  console.log(chalk.bold.bgBlue('1pt.one CLI'));
  registerCommanderOptions();

  // Parse arguments
  program.parse(process.argv);
  const options = program.opts();
  const { help, status, retrieve } = options;
  let { longUrl, shortIdentifier } = options;

  // Call different views depending on the options
  if (help) program.help();
  if (status) await checkApiStatus();
  if (retrieve) await retrieveInfo(shortIdentifier);

  // Long url not provided: ask interactively
  ({ longUrl, shortIdentifier } = await askURL());
  await shortenURL(longUrl, shortIdentifier);
})();

/**
 * Register CLI options and arguments with commander
 */
function registerCommanderOptions() {
  program
    .version('0.0.1')
    .option('-l, --longUrl <longUrl>', 'Long URL to shorten.')
    .option('-s, --shortIdentifier <shortId>', 'Short identifier to use.')
    .option('-h, --help', 'Show help.')
    .option('-S, --status', 'Show API status.')
    .option('-i, --info <url>', 'Retrieve some information and stats about a shortened URL.');
}
