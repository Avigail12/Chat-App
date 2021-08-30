const oracledb = require('oracledb');
const dbConfig = require("../dbConfig");
const {getAllMessagesRepo,getMessageFromRec,create,getMessageRepo,deleteMessagesRepo} = require("../models/message");

// get all Messages from db with filter params
async function getAllMessages(req, res) {

    const { from_name, to_name, created_at} = req.query
    var queryObject = ""
    var bind = {}

    if(from_name){
        queryObject = `FROM_NAME = :from_name`/*{ $regex: from_name, $options: 'i' } */
        bind = {from_name:from_name}
    }
    if(to_name){
        if(queryObject) queryObject = `${queryObject} and TO_NAME = :to_name`
        else queryObject = `TO_NAME = :to_name` 
        bind =  {to_name:to_name}
        if(from_name) bind =  {from_name:from_name,to_name:to_name}
    }
    if(created_at){
        if(queryObject) queryObject = `${queryObject} and CREATED_AT = :created_at`
        else queryObject = `CREATED_AT = :created_at` 
        bind =  {created_at:created_at}
        if(from_name & to_name) bind =  {from_name:from_name,to_name:to_name,created_at:created_at}
        if(from_name & !to_name) bind =  {from_name:from_name,created_at:created_at}
        if(!from_name & to_name) bind =  {to_name:to_name,created_at:created_at}
    }
    try {
     rows = await getAllMessagesRepo(queryObject,bind)
   } catch (err) {
        return res.status(400).json({ status: "fail", message: err.message })
   } finally {
     if (result.rows.length == 0) {
       return res.status(200).json({ status: "ok", payload: 'query send no rows' })
     } else {
       return res.status(200).json({ status: "ok", payload: rows })
     }
   }
 }

 // get Message according to the key field
 async function getMessage(req, res) {
    const { key } = req.params;

    try {
      row = await getMessageRepo(key)
   } catch (err) {
     return res.status(400).json({ status: "fail", message: err.message })
   } finally {
     if (row.length == 0) {
       return res.send('query send no rows');
     } else {
        res.status(200).json({ status: "ok", payload:row  })/*.send(result.rows) */
     }
   }
 }
// create Message and save in db 
 async function createMessages(req, res) {
    try {
        if(!req.body.from_name){
          return res.status(400).json({ status: "fail", message: `please provide a value to from_name field` })
        }   
        if(!req.body.to_name){
          return res.status(400).json({ status: "fail", message: `please provide a value to to_name field` })
        }   
        if(!req.body.message){
          return res.status(400).json({ status: "fail", message: `please provide a value to message field` })
        }        
        let message = getMessageFromRec(req);

       message = await create(message);

      return res.status(200).json({ status: "ok", payload: message })

    } catch (err) {
      return res.status(400).json({ status: "fail", message: err.message })
    }
  }
// delete Message from db according to the key field
  async function deleteMessages(req, res) {
    const { key } = req.params;

    try {
      row = await deleteMessagesRepo(key)
      if(row == -1)return res.status(400).json({ status: "fail", message: 'key not exists' })
    } catch (err) {
      return res.status(400).json({ status: "fail", message: err.message })
    }
    res.status(200).json({ success: true, data: 'Daleted was succesufully' })
  }


 module.exports = {
    getAllMessages,
    getMessage,
    createMessages,
    deleteMessages
  }