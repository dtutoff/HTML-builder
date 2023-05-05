const { join } = require('path');
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');
const { stdin: input, stdout: output, } = require('process');

const TEXT_FILE = 'text.txt';

const ws = createWriteStream(join(__dirname, TEXT_FILE))
  .on('error', err => console.log(err));

const rl = createInterface({ input, output })
  .on('error', err => console.log(err));

rl.question('Enter text (\'exit\' for close):\n', str => {
  str === 'exit' ? rl.close() : ws.write(`${str}`);
});

rl.on('line', (str) => {
  str === 'exit' ? rl.close() : ws.write(`\n${str}`);
});

rl.on('close', () => console.log('Have a nice day!'));