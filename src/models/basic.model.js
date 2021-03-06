const {Model}= require('objection')
const knex=require('../knex')

Model.knex(knex);

class BasicModel extends Model{

    $beforeInsert(queryContext) {
         this.created_at= new Date().toISOString();
         this.updated_at= new Date().toISOString();
    }
    $beforeUpdate(opt, queryContext) {
        this.updated_at= new Date().toISOString();
    }

    //zabezpieczenie przed modyfikacją id
    $formatDatabaseJson(json) {
         json= super.$formatDatabaseJson(json);
         delete json.id;
         return json;
    }
}
module.exports = BasicModel;
