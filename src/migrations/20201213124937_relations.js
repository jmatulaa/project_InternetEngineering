
exports.up = function(knex) {
    return knex.schema.createTable('Rating', (table)=>{
        table.increments().primary();
        table.integer('rating').notNullable();
        table.string('opinion').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('gameId').references('Game.id').onDelete('CASCADE');
    }).createTable('GenreOfGame',(table)=>{
        table.increments().primary();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('gameId').references('Game.id').onDelete('CASCADE');
        table.integer('genreId').references('Genre.id').onDelete('CASCADE');
    }).createTable('Producer',(table)=>{
        table.increments().primary();
        table.string('name').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        //table.integer('gameId').references('Game.id').onDelete('CASCADE');
    }).createTable('userGame',(table)=>{
        table.increments().primary();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('gameId').references('Game.id').onDelete('CASCADE'); //nie wiem czy to delete zostawic
        table.integer('userId').references('User.id').onDelete('CASCADE');
    })

};

exports.down = function(knex) {
    return knex.schema.
        dropTable('Rating').
        dropTable('GenreOfGame').
        dropTable('Producer').
        dropTable('userGame');
};
