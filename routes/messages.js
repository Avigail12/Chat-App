const { debug } = require('console');
const express = require('express')
const oracledb = require('oracledb');
const crypto = require("crypto");
const router = express.Router();

//get /MESSAGES
async function selectAllEmployees(req, res) {
    console.log('startttt');
    try {
      connection = await oracledb.getConnection({
        user: 'course2',
        password: 'course2#',
        connectString: '100.100.100.19:1522/TIRGUL'
      });
  
      console.log('connected to database');
      // run query to get all employees
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
        //query return zero employees
        return res.send('query send no rows');
      } else {
        //send all employees
        return res.send(result.rows);
      }
  
    }
  }
  
  //get /employess
  router.get('/', function (req, res) {
    selectAllEmployees(req, res);
  })

  function getMessageFromRec(req) {

    let current_date = new Date();
    console.log(current_date);
    const message = {
        id: 11,
        from_name: req.body.from_name,
        to_name: req.body.to_name,
        message: req.body.message,
        created_at: current_date,
        updated_at: current_date,
        key: req.body.key,
    };
    return message;
  }
  
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

async function post(req, res) {
    try {
      let message = getMessageFromRec(req);
      message = await create(message);
  
      res.status(201).json(message);
    } catch (err) {
        console.log('error');
      res.status(400).json(err);
    }
  }

  async function create(mess) {
    const message = Object.assign({}, mess);

    message.key = crypto.randomBytes(4).toString("hex");

    console.log(message);
    // const result = await database.simpleExecute(createSql, message);
    var connection = await oracledb.getConnection({
        user: 'course2',
        password: 'course2#',
        connectString: '100.100.100.19:1522/TIRGUL'
    });

    connection.execute(`insert into MESSAGES (ID,FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (:${message.id},:${message.from_name},:${message.to_name},:${message.message},:${message.created_at},:${message.updated_at},:${message.key})`, 
    message,{ autoCommit: true },
    {outFormat:oracledb.OBJECT},
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
  }

//   const createSql =
//  'insert into MESSAGES (FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (:FROM_NAME,:TO_NAME,:MESSAGE,:CREATED_AT,:UPDATED_AT,:KEY,)'

  router.post('/', (req,res) => {
      console.log('post req');
        post(req,res)
  })

  const getDeleteSavedFolderStatus = async (req, res) => {
    const { key } = req.params;
    console.log(key);
    var connection = await oracledb.getConnection({
        user: 'course2',
        password: 'course2#',
        connectString: '100.100.100.19:1522/TIRGUL'
    });
    // await dbConnection.createPool();
    // await dbConnection.init();
    // oracledb.autoCommit = true;

    if (key) {
    console.log('enter');
      const query = `DELETE FROM MESSAGES WHERE KEY=${key}`;
      console.log('query');
      const result = await connection.execute(query,[key],{ autoCommit: true });
      // await connection.commit();
  
      console.log('#####  Generated Query  ###### \n' + query);

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