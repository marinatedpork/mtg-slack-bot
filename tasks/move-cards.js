/**
 * Usage:
 *
 * PATH_TO_JSON=/Users/m/projects/mtgjson/json PATH_TO_DESTINATION=/Users/m/projects/slack-watcher/data node ./tasks/move-cards.js
 *
 */

const fs = require('fs');
const copyFile = require('fs-extra').copySync;
const path = require('path');
const jsonPath = process.env.PATH_TO_JSON;
const destination = process.env.PATH_TO_DESTINATION;
var numberOfFilesMoved = 0;

function isEnglish(file) {
  return (file.match(/\./g) || []).length === 1;
}

function isMedia(file) {
  return file.indexOf('p') === 0;
}

function isEditorConfig(file) {
  return file === '.editorconfig';
}

function move(file) {
  if (isEnglish(file) && !isMedia(file) && !isEditorConfig(file)) {
    console.log(`Copying ${file}`);
    let oldPath = path.join(jsonPath, file);
    let newPath = path.join(destination, file);
    copyFile(oldPath, newPath);
    numberOfFilesMoved++;
  }
}

if (fs.existsSync(path)) {
  fs.rmdirSync(destination);
  fs.mkdirSync(destination);
}

fs.readdirSync(jsonPath).forEach(move);
console.log(`\nMoved ${numberOfFilesMoved} files`);
