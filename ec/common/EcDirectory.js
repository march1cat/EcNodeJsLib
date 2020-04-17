'use strict'
const Basis = require("../system/Basis").Basis;
const FileTool = require('./FileTool').FileTool;


class EcDirectory extends Basis {
    
    uri = null;
    constructor (uri , autoGenerate) {
        super();
        this.uri = uri;
        if(autoGenerate) {
            const fileTool = new FileTool();
            fileTool.mkdir(uri);
        }
    }

    viewFiles(){
        const fileTool = new FileTool();
        const fileNames = fileTool.viewFiles(this.Uri());
        const items = [];
        fileNames.forEach(
            name => {
                items.push(
                    {
                        name : name ,
                        isfolder : fileTool.isDirectory(this.Uri() + name)
                    }
                )
            }
        );
        return items;
    }

    Uri(){
        return this.uri.endsWith("/") ? this.uri : this.uri + "/";
    }

    getContainFileAmount(){
        const fileTool = new FileTool();
        return  fileTool.countFileAtDirectory(this.Uri());
    }

}

module.exports.EcDirectory = EcDirectory;