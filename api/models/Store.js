/**
* Store.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        name: {
            type: "string"
        },
        address: {
            type: "string"
        },
        storeNumber: {
            type: "string"
        },
        phone: {
            type: "string"
        },
        deviceNoEDS: {
            type: "string"
        },
        managementID: {
            type: "string"
        },
        authorizationCode: {
            type: "string"
        },
        installTime: {
            type: "datetime"
        },
        city: {
            type: "string"
        },
        iccID: {
            type: "string"
        },
        devices: {
            type: "string"
        }
    }
};

