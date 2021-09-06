const oracledb = require('oracledb');
const dbConfig = require("../dbConfig");
require('dotenv').config()
const knex = require('knex')({
  client: 'oracledb',
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString : process.env.DB_CONNECTSTRING,
  },
  fetchAsString: [ 'number', 'clob' ]
});


 // return user according to the username field 
 async function getuserRepo(username) {
  try {
    const user = await knex.where('USERNAME',username).first().from("USERS")
    return user;
 } catch (err) {
   throw err;
 }
}

module.exports = {getuserRepo}