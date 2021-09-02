const oracledb = require('oracledb');
const crypto = require("crypto");
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

// return all Messages from db with filter params
async function getAllMessagesRepo(bind) {

    const sql = ""
    try {
      // connection = await oracledb.getConnection(dbConfig);
      if(bind){
        rows = await knex.where(bind).select().from("MESSAGES").orderBy('ID','desc')
      }else{
        rows = await knex.select().from("MESSAGES").orderBy('ID','desc')
      }
      return rows
   } catch (err) {
     throw err;
   }

 }
  // return Message according to the key field 
 async function getMessageRepo(key) {
  try {
    const rows = await knex.where('KEY',key).select().from("MESSAGES")
    return rows;
 } catch (err) {
   throw err;
 }

}
//delete Message from db according to the key field and return how many rows deleted 
async function deleteMessagesRepo(key) {

  try {
    result = await knex.where('KEY',key).select(1).from("MESSAGES")
    if(result.length == 0)return -1;

    if(key){
      result = await knex('MESSAGES').where('KEY', key).del()
    }
    return result
 } catch (err) {
   throw err;
 }
}
// create message object for insert
 function getMessageFromRec(req) {

    let current_date = +new Date
    current_date = new Date();

    const message = {
        FROM_NAME: req.body.from_name,
        TO_NAME: req.body.to_name,
        MESSAGE: req.body.message,
        CREATED_AT: req.body.date?new Date(req.body.date):current_date,
        UPDATED_AT: current_date,
        KEY: req.body.key,
    };
    return message;
  }
// create message and save in db, return the new message
  async function create(mess) {
    const message ={...mess}  /*Object.assign({}, mess)-[...mess]-{...mess}*/

    if(message.KEY){
      result = await knex.where('KEY',message.KEY).select(1).from("MESSAGES")
      if(result.length)return;
    }
    else{
      message.KEY = crypto.randomBytes(2).toString("hex");
    }

    try {
        result = await knex('MESSAGES').returning().insert(message)
        return message;
    } catch (error) {
        throw error;
    }
    
  }

 module.exports = {getAllMessagesRepo,getMessageFromRec,create,getMessageRepo,deleteMessagesRepo}