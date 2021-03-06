const {Model}= require('objection')
const knex=require('../knex')
const BasicModel = require("./basic.model")

Model.knex(knex);

class User extends BasicModel{
    static get tableName(){
        return 'User';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                email: {type: 'string'},
                username: {type: 'string'},
                password: {type: 'string'},
                bonusPoints: {type: 'integer'}
            }
        }
    }

    static relationMappings={
        userGame: {
            relation: Model.ManyToManyRelation,
            modelClass: require('./game.model'),
            join:{
                from: 'User.id',
                to: 'Game.id',
                through: {
                    from: 'userGame.userId',
                    to: 'userGame.gameId'
                }
            }
        }
    };
}

module.exports = User;