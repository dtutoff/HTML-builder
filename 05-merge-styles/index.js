const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { join, extname } = require('path');

const stylesPath = join(__dirname, 'styles');
const distPath = join(__dirname, 'project-dist', 'bundle.css');

const output = createWriteStream(distPath);

const getStylesFiles = async () => {
  return (await readdir(stylesPath)).filter(file => extname(file) === '.css');
};

const writeToBundleFile = async (files) => {
  await files.forEach(file => {
      const input = createReadStream(join(stylesPath, file));
      input.on('data', data => {
        output.write(data.toString() + '\n');
      });
  });

  console.log('Building complete');
};

getStylesFiles()
  .then(files => writeToBundleFile(files))
  .catch(err => console.log('Building failed', err));