/**
 * UserJXY.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'user_jxy',
    attributes: {
        openId: {
            type: 'string',
            columnName: 'open_id'
        },
        name: {
            type: 'string'
        },
        nickname: {
            type: 'string'
        },
        //0为女性，1为男性
        sex: {
            type: 'integer',
            enum: ['0', '1']
        },
        mobile: {
            type: 'integer',
            size: 64
        },
        userJob: {
            type: 'string',
            columnName: 'user_job',
            enum: ['销售', '店长', '经理', '其他']
        },
        headImg: {
            type: 'string',
            columnName: 'head_img'
        },
        stores: {
            collection:'storeJXY',
            via:'employees'
        }
    }
};

