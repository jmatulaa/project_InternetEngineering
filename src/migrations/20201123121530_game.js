
//metoda uaktualniajaca db
exports.up = function(knex) {
    return knex.schema.createTable('Game', (table)=>{
        table.increments().primary();
        table.string('name').notNullable();
        table.double('price');
        table.integer('ageRange');
        table.string('languageVersion').notNullable();
        table.string('mode').notNullable();
        table.integer('producerId').references('Producer.id').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    })
};

//metoda usuwajaca zmiane, ktora zostala wprowdzona
exports.down = function(knex) {
    return knex.schema.dropTable('Game');
};

