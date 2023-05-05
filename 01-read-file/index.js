const { createReadStream } = require('fs');
const { join } = require('path');

const FILE = 'text.txt';

createReadStream(join(__dirname, FILE))
  .on('error', err => console.log(err))
  .pipe(process.stdout);