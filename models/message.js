const oracledb = require('oracledb');
const crypto = require("crypto");
const dbConfig = require("../dbConfig");
const knex = require('knex')({
  client: 'oracledb',
  connection: {
    user: 'course2',
    password: 'course2#',
    connectString : '100.100.100.19:1522/TIRGUL',
  },
  fetchAsString: [ 'number', 'clob' ]
});

// return all Messages from db with filter params
async function getAllMessagesRepo(queryObject,bind) {

    const sql = ""
    try {
      // connection = await oracledb.getConnection(dbConfig);
      if(queryObject){
        rows = await knex.where(bind).select().from("MESSAGES")
         console.log(rows);
        // return rows;
        // const sql = `SELECT * FROM MESSAGES WHERE ${queryObject}`
        // result = await connection.execute(sql,bind);
      }else{
        rows = await knex.select().from("MESSAGES")
        // result = await connection.execute(`SELECT * FROM MESSAGES`);
      }
      // return result.rows
      return rows
   } catch (err) {
     throw err;
   }
   finally {
    // await connection.close()
  }
 }
  // return Message according to the key field 
 async function getMessageRepo(key) {
  try {
    const rows = await knex.where('KEY',key).select().from("MESSAGES")
    return rows;

    // connection = await oracledb.getConnection(dbConfig);
    // if(key){
    //   result = await connection.execute(`SELECT * FROM MESSAGES WHERE KEY =:key`,[key]);
    // }
    //  return result.rows
 } catch (err) {
   throw err;
 }
 finally {
  // await connection.close()
}
}
//delete Message from db according to the key field and return how many rows deleted 
async function deleteMessagesRepo(key) {
  try {
    // connection = await oracledb.getConnection(dbConfig);
    result = await knex.where('KEY',key).select(1).from("MESSAGES")
    if(result.length == 0)return -1;
    // const query = `select 1 FROM MESSAGES WHERE KEY=:key`;
    // result = await connection.execute(query,[key])
    // if(result.rows.length == 0){
    //   return -1;
    // }
    if(key){
      result = await knex('MESSAGES').where('KEY', key).del()
      console.log(result);
      // const query = `DELETE FROM MESSAGES WHERE KEY=:key`;
      // result = await connection.execute(query,[key],{ autoCommit: true });
    }
    return result
 } catch (err) {
   throw err;
 }
 finally {
  // await connection.close()
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
        CREATED_AT: current_date,
        UPDATED_AT: current_date,
        KEY: req.body.key,
    };
    return message;
  }
// create message and save in db, return the new message
  async function create(mess) {
    const message ={...mess}  /*Object.assign({}, mess)-[...mess]-{...mess}*/

    message.KEY = crypto.randomBytes(2).toString("hex");
    // connection = await oracledb.getConnection(dbConfig);

     //const sql = "INSERT INTO MESSAGES (FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (?, ?, ?, ?, ?, ?)";
    // const sql = "INSERT INTO MESSAGES (FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (:from_name, :to_name, :message, :created_at, :updated_at, :key)";

    // const options = {
    //     autoCommit: true,
    // };
    // const binds = message /*{  from_name:message.from_name, to_name: message.to_name, message: message.message, created_at: message.created_at, updated_at: message.updated_at, key: message.key}*/
     
    try {
      console.log(message);
        result = await knex('MESSAGES').returning().insert(message)
        // const result = await connection.execute(sql,  binds, options);
        return message;
    } catch (error) {
        throw error;
    }
    finally {
      // await connection.close()
    }
    
  }

 module.exports = {getAllMessagesRepo,getMessageFromRec,create,getMessageRepo,deleteMessagesRepo}