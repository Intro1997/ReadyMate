#!/usr/bin/env node

const { program } = require('commander');
const { check } = require('../src/index');
const package = require('../package.json');

program
  .version(package.version)
  .description('Check and install software dependencies')
  .option('-c, --config-file <path>', 'Path to config file (defaults to ready_mate_config.json)')
  .option('-y, --yes', 'Skip confirmation steps')
  .action(async (options) => {
    try {
      const success = await check(options.configFile, options.yes);
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv); 