
exports.up = function(knex) {
    return knex.schema.createTable('User', (table)=>{
        table.increments().primary();
        table.string('email').notNullable();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.integer('bonusPoints');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('User');
};
