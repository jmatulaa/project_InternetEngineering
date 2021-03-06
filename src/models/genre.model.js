const {Model}= require('objection')
const knex=require('../knex')
const BasicModel = require("./basic.model")

Model.knex(knex);

class Genre extends BasicModel{
    static get tableName(){
        return 'Genre';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                name: {type: 'string'}
            }
        }
    }

}

module.exports = Genre;