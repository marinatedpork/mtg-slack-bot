#!/usr/local/bin/node

/**
 *
 * Creates AMI in AWS for a given environment.
 *
 * Usage:
 *
 *   - DEV  : pack.js us-east-2-dev
 *   - PROD : pack.js us-east-2-prod
 *
 */

const exec = require('child_process').execSync;
const [ tfEnv ] = process.argv.slice(-1);
const opts = { stdio: [0, 1, 2] };
const BUILD_ENV = tfEnv.includes('-prod') ? 'prod' : '';

exec(`cd ../ && BUILD_ENV=${BUILD_ENV} ./build-dist`, opts);
exec(`cd ami && packer build -var-file=../config/ami-${tfEnv}.json mtg-slack-bot.json`, opts);
