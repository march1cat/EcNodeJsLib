'use strict'
const Basis = require('../system/Basis').Basis;

class HttpOperation extends Basis{

    req = null;
    res = null;
    param = null;
    body = null;
    query = null;

    constructor(req , res){
        super();
        this.req = req;
        this.res = res;
        this.param = this.req.params;
        this.body = this.req.body;
        this.query = this.req.query;
    }


    getRequest(){
        return this.req;
    }

    getParams(){
        //Path Variable
        return this.param;
    }

    getQuery(){
        //Query String
        return this.query;
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