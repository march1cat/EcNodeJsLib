'use strict'
const Basis = require('../system/Basis').Basis;

class RequestHandler extends Basis {

    static HTTP_METHOD = {
        GET : 'get',
        POST : 'post'
    }
    static BODY_CONTENT_TYPE = {
        PLAIN_TEXT : 'text',
        FORM_ENCODE : 'form'
    }

    httpMethod = RequestHandler.HTTP_METHOD.GET;
    bodyContentType = RequestHandler.BODY_CONTENT_TYPE.FORM_ENCODE;
    routePath = null;
    onRequest = null;

    constructor(){
        super();
    }

    setOnGet(){
        this.httpMethod = RequestHandler.HTTP_METHOD.GET;
    }

    setOnPost( bodyContentType ){
        this.httpMethod = RequestHandler.HTTP_METHOD.POST;
        this.bodyContentType = bodyContentType;
    }

    bindOnRequest(routePath , onRequest){
        this.routePath = routePath;
        this.onRequest = onRequest;
    }

    onHttpRequest( httpOperation ){
        if(this.onRequest) this.onRequest(httpOperation);
    }

}

module.exports = {
    RequestHandler : RequestHandler
}