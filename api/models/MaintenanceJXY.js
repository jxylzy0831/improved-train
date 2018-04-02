/**
 * MaintenanceJXY.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'maintenance_jxy',
    attributes: {
        type: {
            type: 'integer'
        },
        userId: {
            type: 'integer',
            columnName: 'user_id'
        },
        storeId: {
            type: 'integer',
            columnName: 'store_id'
        },
        problemType: {
            type: 'string',
            columnName: 'problem_type'
        },
        problemDescription: {
            type: 'string',
            columnName: 'problem_description'
        },
        img: {
            type: 'string'
        }
    }
};

