const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'stefan',  
  database: 'softprim_test',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();