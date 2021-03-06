const knexCfg = require('../knexfile')
const knex = require('knex')(knexCfg)
module.exports = knex