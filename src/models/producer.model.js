const {Model}= require('objection')
const knex=require('../knex')
const BasicModel = require("./basic.model")

Model.knex(knex);

class Producer extends BasicModel{
    static get tableName(){
        return 'Producer';
    }

    static relationMappings={
        producer: {
            relation: Model.HasManyRelation,
            modelClass: require('./game.model'),
            join:{
                from: 'Game.producerId',
                to: 'Producer.id'
            }
        }
    };
}

module.exports = Producer;