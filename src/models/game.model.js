
const {Model}= require('objection')
const knex=require('../knex')
const BasicModel = require("./basic.model")
const Genre = require("./genre.model");

Model.knex(knex);


class Game extends BasicModel{
    static get tableName(){
        return 'Game'; //tableName() zwraca nazwe tabeli w bazie danych
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties: {
                name: {type: 'string'},
                price: {type: 'double'},
                ageRange: {type: 'integer'},
                languageVersion: {type: 'string'},
                mode: {type: 'string'}
            }
        }
    }

    static get relationMappings()
    {
        return {
            ratingGame: {
                relation: Model.HasManyRelation,
                modelClass: require('./rating.model'),

                join: {
                    from: 'Game.id',
                    to: 'Rating.gameId'
                }
            },
            genreGame: {
                relation: Model.ManyToManyRelation,
                modelClass: Genre,

                join: {
                    from: 'Game.id',
                    to: 'Genre.id',
                    through:{
                        from: 'GenreOfGame.gameId',
                        to: 'GenreOfGame.genreId'
                    }
                }
            },
            producer: {
                relation: Model.BelongsToOneRelation,
                modelClass: require('./producer.model'),

                join: {
                    from: 'Game.producerId',
                    to: 'Producer.id'
                }
            },
            userGame: {
                relation: Model.ManyToManyRelation,
                modelClass: require('./user.model'),

                join: {
                    from: 'Game.id',
                    to: 'User.id',
                    through:{
                        from: 'userGame.gameId',
                        to: 'userGame.userId'
                    }
                }
            }
        };
    }


}

module.exports = Game;