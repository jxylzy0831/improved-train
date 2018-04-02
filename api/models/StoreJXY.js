/**
 * StoreJXY.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'store_jxy',
    attributes: {
        storeName: {
            type: 'string',
            columnName: 'store_name'
        },
        storeNumber: {
            type: 'string',
            columnName: 'store_number'
        },
        address: {
            type: 'string'
        },
        storePhone: {
            type: 'integer',
            size:64,
            columnName: 'store_phone'
        },
        city: {
            type: 'string'
        },
        employees:{
            collection:'userJXY',
            via:'stores'
        }
    }
};

