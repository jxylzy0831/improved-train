/**
 * DeviceJXY.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName: 'device_jxy',
    attributes: {
        name: {
            type: 'string'
        },
        storeId: {
            type: 'integer',
            columnName: 'store_id'
        },
        password: {
            type: 'string'
        },
        authorizationCode: {
            type: 'integer',
            columnName: 'authorization_code'
        },
        deviceNo: {
            type: 'string',
            columnName: 'device_no'
        },
        managementId: {
            type: 'string',
            columnName: 'management_id'
        },
        iccid: {
            type: 'string'
        }
    }
};

