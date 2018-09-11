#!/usr/local/bin/node

/**
 * Usage: "build.js plan us-east-2-dev" or "build.js apply us-east-2-dev"
 */

const exec = require('child_process').exec;
const opts = { stdio: [0, 1, 2] };

const [ tfCommand, tfEnv ] = process.argv.slice(-2);
const stateFile = `${process.env.MTG_STATE}/${tfEnv}.tfstate`;
const varFile = `./config/${tfEnv}.tfvars`;
const command = `terraform ${tfCommand} ${tfCommand === 'apply' ? '-auto-approve' : ''} --state=${stateFile} --var-file=${varFile}`;

console.log(command);
const tfExec = exec(command);

tfExec.stdout.pipe(process.stdout);
tfExec.stdin.pipe(process.stdin);
tfExec.stderr.pipe(process.stderr);
