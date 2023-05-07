const fs = require('fs/promises');
const { join } = require('path');

const DIR = join(__dirname, 'files');
const DIR_COPY = join(__dirname, 'files-copy');

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

const copyFolder = async (folder) => {
  if (await checkIfFolderExist(DIR_COPY)) {
    await fs.rm(DIR_COPY, {
      recursive: true
    }, err => {
      if(err) throw new Error(err.message);
    });
  }

  await fs.mkdir(DIR_COPY);

  await folder.forEach(file => {
    fs.copyFile(join(DIR, file), join(DIR_COPY, file));
    console.log(file);
  });
};

fs.readdir(DIR).then((folder) => copyFolder(folder));