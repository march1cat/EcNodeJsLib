'use strict'

const Basis = require("../system/Basis").Basis;
const zip_folder = require('zip-folder');
const FileTool = require("../common/FileTool").FileTool;

class Zipper extends Basis{

    fileTool = new FileTool();
    constructor(){
        super();
    }

    zipDirectory(sourceDir , saveTo){
        return new Promise(
            (resolve , reject) => {
                if(this.fileTool.isFileExist(sourceDir) && this.fileTool.isDirectory(sourceDir)){
                    this.fileTool.deleteFile(saveTo);
                    zip_folder(sourceDir, saveTo, function(err) {
                        if(err)  reject(err);
                        else  resolve();
                    });
                } else {
                    reject(`Directory ${sourceDir} not exist!!`);
                }
            }
        );
    }
}

module.exports.Zipper = Zipper;