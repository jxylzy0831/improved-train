/**
 * CommonProblemJXY.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'common_problem_jxy',
    attributes: {
        type: {
            type: 'integer'
        },
        problem: {
            type: 'string'
        },
        answer: {
            type: 'string'
        },
        url: {
            type: 'string'
        },
        docDownload: {
            type: 'string',
            columnName: 'doc_download'
        }
    }
};

