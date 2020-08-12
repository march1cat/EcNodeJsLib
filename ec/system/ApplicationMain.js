'use restrict';
const Basis = require('./Basis').Basis;
const Logger = require("./Logger").Logger;


class ApplicationMain extends Basis {

    constructor(){
        super();
    }

    async process(configObject){
        if(configObject) this.mountAppConfig(configObject);
        const argv = process.argv.slice(2);
        this.log("Application start , command args = " , argv);
        this.log("Application Config = " , this.AppConfig());
        await this.main(argv);
    }

    mountAppConfig(configObject){
        process.AppConfig = configObject;
    }

    mountLog4JS(saveToPath){
        Logger.embedLog4JS(saveToPath)
    }

    async main(args){
        //wait to override
    }

}


module.exports = {
    ApplicationMain : ApplicationMain
}
