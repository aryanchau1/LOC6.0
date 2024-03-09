const Pool = require("pg").Pool;

const pool = new Pool({
  user: "me",
  password: "1029",
  host: "localhost",
  port: 5432,
  database: "hotel_management",
});

module.exports = pool;
