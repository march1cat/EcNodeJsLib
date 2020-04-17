'use restrict';
const Basis = require('./Basis').Basis;


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


    async main(args){
        //wait to override
    }

}


module.exports = {
    ApplicationMain : ApplicationMain
}
