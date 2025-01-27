#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const { main } = require('./mainLogic');

const argv = yargs(hideBin(process.argv))
    .command('run', 'Run the script with an existing configuration', {}, async () => {
        try {
            await main();
            console.log('✅ Success update.');
        } catch (error) {
            console.error('❌ Error command:', error.message);
            process.exit(1);
        }
        process.exit(0);
    })
    .demandCommand(1, 'You need to specify a command (setup or run).')
    .help()
    .alias('help', 'h')
    .argv;