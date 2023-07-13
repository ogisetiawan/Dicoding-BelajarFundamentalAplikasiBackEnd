const fs = require('fs'); //? file

class StorageService {
    constructor(folder) {
        this._folder = folder;
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    writeFile(file, meta) {
        const filename = +new Date() + meta.filename; //? filename with timestamp
        const path = `${this._folder}/${filename}`;
     
        const fileStream = fs.createWriteStream(path); //? writable stream from path 
        
        //? async prosses
        return new Promise((resolve, reject) => {
          fileStream.on('error', (error) => reject(error));
          file.pipe(fileStream);
          file.on('end', () => resolve(filename)); //? if success call resolve with filename
        });
    }
}

module.exports = StorageService;