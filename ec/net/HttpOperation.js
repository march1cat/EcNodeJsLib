'use strict'
const Basis = require('../system/Basis').Basis;

class HttpOperation extends Basis{

    req = null;
    res = null;
    param = null;
    body = null;

    constructor(req , res){
        super();
        this.req = req;
        this.res = res;
        this.param = this.req.params;
        this.body = this.req.body;
    }


    getRequest(){
        return this.req;
    }

    getResponse(){
        return this.res;
    }

    getBody(){
        return this.body;
    }

    responseToClient(data){
        this.res.send(data);
    }

}

module.exports = {
    HttpOperation : HttpOperation
}