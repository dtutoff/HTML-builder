const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { join, extname } = require('path');
const { Transform } = require('stream');

const STYLES_DIR = join(__dirname, 'styles');
const ASSETS_DIR = join(__dirname, 'assets');
const COMPONENTS_DIR = join(__dirname, 'components');
const TEMPLATE = join(__dirname, 'template.html');

const OUTPUT_FOLDER = join(__dirname, 'project-dist');

const checkIfFolderExist = async (folder) => {
  let result;
  await fs
    .access(folder)
    .then(() => {
      result = true;
    })
    .catch(() => {
      result = false;
    });

    return result;
};

const createFolder = async (folder) => {
   if (await checkIfFolderExist(folder)) {
    await fs.rm(folder, {
      recursive: true
    }, err => {
      if(err) throw new Error(err.message);
    });
  }

  await fs.mkdir(folder);

  return true;
};

const copyFolder = async (fromFolder, toFolder) => {
  await createFolder(join(toFolder));

  const files = await fs.readdir(fromFolder, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const src = join(fromFolder, file.name);
      const dest = join(toFolder, file.name);
      await fs.copyFile(src, dest);
    } else {
      await copyFolder(join(fromFolder, file.name), join(toFolder, file.name));
    }
  }

  return true;
};

const getFilesList = async (folder, ext) => {
  return (await fs.readdir(folder)).filter(file => extname(file) === `.${ext}`);
};

const createStyles = async () => {
  const output = createWriteStream(join(OUTPUT_FOLDER, 'style.css'));
  const styleFiles = await getFilesList(STYLES_DIR, 'css');

  styleFiles.forEach(file => {
    const input = createReadStream(join(STYLES_DIR, file));
    input.on('data', data => {
      output.write(data.toString() + '\n');
    });
  });

  return true;
};

const createLayout = async () => {
  const componentFiles = await getFilesList(COMPONENTS_DIR, 'html');
  const outputFile = await fs.open(join(OUTPUT_FOLDER, 'index.html'), 'w');
  const templateFile = await fs.open(TEMPLATE);

  const inputStream = templateFile.createReadStream();
  const outputStream = outputFile.createWriteStream();

  const transformStream = new Transform({
    async transform(chunk) {
      let result = chunk.toString();

      for (const component of componentFiles) {
        const componentName = component.slice(0, -5);
        const componentContent = await fs.readFile(join(COMPONENTS_DIR, component));
        result = result.replace(`{{${componentName}}}`, componentContent);
      }

      this.push(result);
    },
  });

  inputStream.pipe(transformStream).pipe(outputStream);

  return true;
};

createFolder(OUTPUT_FOLDER)
  .then(() => copyFolder(ASSETS_DIR, join(OUTPUT_FOLDER, 'assets')))
  .then(() => createStyles())
  .then(() => createLayout())
  .then(() => console.log('Project built'))
  .catch((err) => console.log(err.message));