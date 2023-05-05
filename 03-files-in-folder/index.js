const { readdir, stat } = require('fs/promises');
const { join } = require('path');

const FOLDER = join(__dirname, 'secret-folder');

readdir(FOLDER, { withFileTypes: true })
  .then(dir => {
    dir.forEach(el => {
      if(!el.isDirectory()) {
        stat(join(FOLDER, el.name))
          .then(file => {
            const [fileName, fileExt] = [...el.name.split('.')];
            const fileSize = file.size > 1024 ?
             `${(file.size / 1024).toFixed(3)}kb`:
             `${file.size}b`;

            console.log(`${fileName} - ${fileExt} - ${fileSize}`);
          }).catch(err => console.log(err));
      }
    })
  });