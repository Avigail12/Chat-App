const oracledb = require('oracledb');
const crypto = require("crypto");
const dbConfig = require("../dbConfig");

async function getAllMessagesRepo(conn) {

    try {
     result = await conn.execute(`SELECT * FROM MESSAGES`);
     return result.rows

   } catch (err) {
     return res.send(err.message);
   }
 }

 function getMessageFromRec(req) {

    let current_date = +new Date
    current_date = new Date();

    const message = {
        from_name: req.body.from_name,
        to_name: req.body.to_name,
        message: req.body.message,
        created_at: current_date,
        updated_at: current_date,
        key: req.body.key,
    };
    return message;
  }

  async function create(mess) {
    const message = Object.assign({}, mess);

    message.key = crypto.randomBytes(2).toString("hex");

    console.log(message);
    // const result = await database.simpleExecute(createSql, message);
    connection = await oracledb.getConnection(dbConfig);

     //const sql = "INSERT INTO MESSAGES (FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (?, ?, ?, ?, ?, ?)";
    const sql = "INSERT INTO MESSAGES (FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (:from_name, :to_name, :message, :created_at, :updated_at, :key)";
    
    const options = {
        autoCommit: true,
    };
    const binds = {  from_name:message.from_name, to_name: message.to_name, message: message.message, created_at: message.created_at, updated_at: message.updated_at, key: message.key}
     
    try {
        const result = await connection.execute(sql,  binds, options,
            function(err){
        if(err){
            console.log(err);
        }
    });
    if (connection) { // conn assignment worked, need to close
        try {
          await connection.close();
        } catch (err) {
          console.log(err);
        }
      }
        return message;
    } catch (error) {
        console.log(error);
    }
    
  }

 module.exports = {getAllMessagesRepo,getMessageFromRec,create}