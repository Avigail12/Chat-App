const { debug, timeStamp } = require('console');
const express = require('express')
const oracledb = require('oracledb');
const crypto = require("crypto");
const dbConfig = require("../dbConfig");
const { json } = require('express');
const router = express.Router();

async function getAllMessages(req, res) {
     try {
      connection = await oracledb.getConnection(dbConfig);

      console.log('connected to database');
      result = await connection.execute(`SELECT * FROM MESSAGES`);
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('close connection success');
        } catch (err) {
          console.error(err.message);
        }
      }
      if (result.rows.length == 0) {
        return res.send('query send no rows');
      } else {
        //send all messages
        return res.send(result.rows);
      }
  
    }
  }
  
  //get /messages
  router.get('/', function (req, res) {
    getAllMessages(req, res);
  })

  async function getMessage(req, res) {

    const { key } = req.params;

    try {
     connection = await oracledb.getConnection(dbConfig);
     result = await connection.execute(`SELECT * FROM MESSAGES WHERE KEY = '${key}'`);
   } catch (err) {
     //send error message
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
        res.send(result.rows)
     }
   }
 }

    //get /messages/id
    router.get('/:key', function (req, res) {
        getMessage(req,res)
        // JSON.stringify(messages)
    })

  function getMessageFromRec(req) {
    // var timestamp = Number(new Date()) 

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
  
async function post(req, res) {
    try {
        let message = getMessageFromRec(req);
       message = await create(message);
  
      return res.status(201).json(message);
    } catch (err) {
        return res.status(400).json(err);
    }
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
    const binds = //[
          {  from_name:message.from_name, to_name: message.to_name, message: message.message, created_at: message.created_at, updated_at: message.updated_at, key: message.key}
         //[message.from_name,message.to_name,message.message,message.created_at,message.updated_at,message.key],
      //];
     
    try {
        console.log('starttt');
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
        //  res.status(201).json(message);
    } catch (error) {
        console.log(error);
    }
    
  }

//   const createSql =
//  'insert into MESSAGES (FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (:FROM_NAME,:TO_NAME,:MESSAGE,:CREATED_AT,:UPDATED_AT,:KEY,)'

  router.post('/', (req,res) => {
        post(req,res)
  })

  const getDeleteSavedFolderStatus = async (req, res) => {
    const { key } = req.params;
    console.log(key);
    connection = await oracledb.getConnection(dbConfig);
    
    if (key) {
    //   const query = `DELETE FROM MESSAGES WHERE KEY='${key}'`;
      const query = `DELETE FROM MESSAGES WHERE KEY=:key`;
      const result = await connection.execute(query,[key],{ autoCommit: true });
      // await connection.commit();
  

      console.log('Result  =>  ' + result.rowsAffected);
  
      await connection.close();

      return result.rowsAffected;
    }
  }

  router.delete('/:key',(req,res) => {
    const deleteStatus  = getDeleteSavedFolderStatus(req,res)
    if(deleteStatus < 1){
        return res
        .status(404)
        .json({ success: false, msg: `error` })
    }
    res.status(200).json({ success: true, data: 'Daleted was succesufully' })
  })

module.exports = router


//   async function post(req, res, next) {
//     try {
//         debug
//       let message = getMessageFromRec(req);

//       message = await create(message);
  
//       res.status(201).json(message);
//     } catch (err) {
//       next(err);
//     }
//   }