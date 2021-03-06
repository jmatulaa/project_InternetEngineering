const {Model}= require('objection')
const knex=require('../knex')
const BasicModel = require("./basic.model")

Model.knex(knex);

class Rating extends BasicModel{
    static get tableName(){
        return 'Rating';
    }

    static relationMappings={
     ratingGame: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./game.model'),
         join:{
                from: 'Rating.gameId',
                to: 'Game.id'
         }
     }
    };
}

module.exports = Rating;