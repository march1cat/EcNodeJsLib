'use strict'

const Basis = require('../system/Basis').Basis;
const RequestHandler = require('./RequestHandler').RequestHandler;
const HttpOperation = require('./HttpOperation').HttpOperation;
const bodyParser = require('body-parser')
const express = require('express');


class RestfulService extends Basis {

    constructor(){
        super();
    }


    start( port , reqHandlers , onServiceStarted){
        const app = express();
        reqHandlers.filter( handler => handler.routePath ).forEach( handler => {
            this.log("Add Route Path [" + handler.routePath + "] at listen Port : " + port);

            if(handler.httpMethod == RequestHandler.HTTP_METHOD.POST){
                switch ( handler.bodyContentType ){
                    case RequestHandler.BODY_CONTENT_TYPE.PLAIN_TEXT : 
                        app.use(bodyParser.text({type:"*/*"}));
                        break;
                    case RequestHandler.BODY_CONTENT_TYPE.FORM_ENCODE :
                        app.use(bodyParser.urlencoded({ extended: true })); 
                        break;
                }
            }
            
            let appReqProcess = function(request , response) {
                const op = new HttpOperation(request , response);
                handler.onHttpRequest(op);
            }
            switch (handler.httpMethod) {
                case RequestHandler.HTTP_METHOD.GET : 
                    app.get( handler.routePath , appReqProcess);
                    break;
                case RequestHandler.HTTP_METHOD.POST : 
                    app.post( handler.routePath , appReqProcess);
                    break;
            }

            
        });
        
        app.listen(port,
            () => {
                if(onServiceStarted) {
                    onServiceStarted();
                } else {
                    this.log("Service is starting at port :" + port);
                }
            }
        );
    }

}


module.exports = {
    RestfulService : RestfulService
}