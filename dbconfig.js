require('dotenv').config(); 

const { Client } = require('pg');
const client = new Client({
  user:process.env.DB_USER_NAME,
  host:process.env.HOST,
  database:process.env.DATABASE,
  password:process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports =client;