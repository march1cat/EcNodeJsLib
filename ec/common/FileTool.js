'use strict'
const filesys = require('fs');
const readline = require('readline');

class FileTool {
    mkdir (dir){
        if (!filesys.existsSync(dir)){
            filesys.mkdirSync(dir);
        }
    }

    viewFiles ( path ){
        return filesys.readdirSync(path);
    }

    isFile( path ){
        return filesys.lstatSync(path).isFile();
    }

    isDirectory( path ){
        return filesys.lstatSync(path).isDirectory();
    }

    countFileAtDirectory( path ){
        const files = filesys.readdirSync(path);
        return files.length;
    }

    isFileExist(uri){
       return filesys.existsSync(uri);
    }

    deleteFile(uri){
        if (filesys.existsSync(uri)){
            filesys.unlinkSync(uri);
        }
    }

    writeFile(uri , text , append){
        if(append) {
            filesys.appendFileSync(uri , text);
        } else filesys.writeFileSync(uri , text);
    }


    createOutputStream(outputPath){
        return filesys.createWriteStream(outputPath);
    }

    readFile(uri){
        return filesys.readFileSync(uri);
    }
    readFileAsPlainTexts(uri , code){
        return code ? filesys.readFileSync(uri , code) : filesys.readFileSync(uri , 'utf-8');
    }

    readFileInLines(uri){
        return new Promise (
            (resolve , reject) => {
                const ar = [];
                if(this.isFileExist(uri)){
                    const inputStream = filesys.createReadStream(uri);
                    const lineReader = readline.createInterface({ input: inputStream });
                    lineReader.on('line' , lineText => {
                        ar.push(lineText);
                    });
                    lineReader.on('close' , () => {
                        resolve(ar);
                    });
                    lineReader.on('error' , () => {
                        reject(ar);
                    });
                } else {
                    resolve(ar);
                }
            }
        );
    }
}

module.exports.FileTool = FileTool;