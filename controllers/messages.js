const oracledb = require('oracledb');
const dbConfig = require("../dbConfig");
const {getAllMessagesRepo,getMessageFromRec,create} = require("../models/message");

async function getAllMessages(req, res) {

    const { from_name, to_name, created_at} = req.query
    var queryObject = ""

    if(from_name){
        queryObject = `FROM_NAME = '${from_name}'`/*{ $regex: from_name, $options: 'i' } */
    }
    if(to_name){
        if(queryObject) queryObject = `${queryObject} and `
        queryObject = `TO_NAME = '${to_name}'` 
    }
    if(created_at){
        if(queryObject) queryObject = `${queryObject} and `
        queryObject = `CREATED_AT = '${created_at}'` 
        console.log(queryObject);
    }

    try {
     connection = await oracledb.getConnection(dbConfig);
    //  var rows = getAllMessagesRepo(connection)

    if(queryObject){
        result = await connection.execute(`SELECT * FROM MESSAGES WHERE ${queryObject}`);
    }
    else{
        result = await connection.execute(`SELECT * FROM MESSAGES`);
    }

   } catch (err) {
     return res.send(err.message);
   } finally {
     if (connection) {
       try {
         // Always close connections
         await connection.close();
       } catch (err) {
         console.error(err.message);
       }
     }
     if (result.rows.length == 0) {
       return res.send('query send no rows');
     } else {
       return res.send(result.rows);
     }
   }
 }

 async function getMessage(req, res) {
    const { key } = req.params;
    try {
     connection = await oracledb.getConnection(dbConfig);
     result = await connection.execute(`SELECT * FROM MESSAGES WHERE KEY = '${key}'`);
   } catch (err) {
     return res.send(err.message);
   } finally {
     if (connection) {
       try {
         await connection.close();
       } catch (err) {
         console.error(err.message);
       }
     }
     if (result.rows.length == 0) {
       return res.send('query send no rows');
     } else {
        res.send(result.rows)
     }
   }
 }

 async function createMessages(req, res) {
    try {
        if(!req.body.from_name){
            return res.status(400).json({ success: false, msg: `please provide a value to from_name field` })
        }   
        if(!req.body.to_name){
            return res.status(400).json({ success: false, msg: `please provide a value to to_name field` })
        }   
        if(!req.body.message){
            return res.status(400).json({ success: false, msg: `please provide a value to message field` })
        }        
        let message = getMessageFromRec(req);

       message = await create(message);
  
      return res.status(201).json(message);
    } catch (err) {
        return res.status(400).json(err);
    }
  }

  async function deleteMessages(req, res) {
    const { key } = req.params;
    connection = await oracledb.getConnection(dbConfig);
    
    if (key) {
      const query = `DELETE FROM MESSAGES WHERE KEY=:key`;
      const result = await connection.execute(query,[key],{ autoCommit: true });
      await connection.close();

      if(rowsAffected < 1){
        return res
        .status(404)
        .json({ success: false, msg: `error` })
    }
    res.status(200).json({ success: true, data: 'Daleted was succesufully' })
    //   return result.rowsAffected;
    }
  }


 module.exports = {
    getAllMessages,
    getMessage,
    createMessages,
    deleteMessages
  }