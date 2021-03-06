// Update with your config settings.
const path=require('path')

const config = {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
  //katalog migracji
  migrations: {
      directory: path.join(__dirname, 'src', 'migrations')
  },
  pool: {  //informacja o polaczeniu
        afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb)   //wykonanie na polaczeniu
        },
       },

};

//eksportowanie obiektu
module.exports = config