'use strict'
const sinon = require("sinon");
const expect = require("chai").expect;

class UnitTestLayer {

    mocks = [];

    constructor(){}

    overrideFunc( target , funcName , newFunc){
        let mock = sinon.stub(target , funcName).callsFake(newFunc);
        this.mocks.push(mock);
    }

    overrideFuncDoNothing( target , funcName){
        let mock = sinon.stub(target , funcName).callsFake( () => {} );
        this.mocks.push(mock);
    }

    forceReturn(target , funcName , returnValue){
        let mock = sinon.stub(target , funcName).returns( returnValue );
        this.mocks.push(mock);
    }


    expectEquals( variable , expectValue ){
        expect(variable).to.equals(expectValue);
    }

    expectGreaterThan( variable , expectValue , includeEqual ){
        if(includeEqual) expect(variable).to.gte(expectValue);
        else expect(variable).to.gt(expectValue);
    }

    expectNotNull(variable){
        if(variable instanceof Array) {
            variable.forEach(  v => expect(v).not.undefined)
        } else expect(variable).not.undefined;
    }

    clear(){
        this.mocks.forEach (mock => {
            if( mock.restore ) mock.restore();
        })
    }

}

module.exports.UnitTestLayer = UnitTestLayer