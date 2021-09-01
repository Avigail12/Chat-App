const {getAllMessagesRepo,getMessageFromRec,create,getMessageRepo,deleteMessagesRepo} = require("../models/message");

// get all Messages from db with filter params
async function getAllMessages(req, res) {

    const { from_name, to_name, created_at} = req.query
    var bind = {}

    if(from_name){
        bind.FROM_NAME = from_name
    }
    if(to_name){
        bind.TO_NAME = to_name
    }
    if(created_at){
        bind.CREATED_AT = created_at
    }
    try {
     rows = await getAllMessagesRepo(bind)
      return res.status(200).json({ status: "ok", payload: rows })
   } catch (err) {
        return res.status(400).json({ status: "fail", message: err.message })
   } 
 }

 // get Message according to the key field
 async function getMessage(req, res) {
    const { key } = req.params;

    try {
      row = await getMessageRepo(key)
      res.status(200).json({ status: "ok", payload:row  })
   } catch (err) {

     return res.status(400).json({ status: "fail", message: err.message })
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
       if(!message){
         return res.status(400).json({ status: "fail", message: `This message already exists` })
       }

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
      res.status(200).json({ success: true, data: 'Daleted was succesufully' })
    } catch (err) {
      return res.status(400).json({ status: "fail", message: err.message })
    }
  }


 module.exports = {
    getAllMessages,
    getMessage,
    createMessages,
    deleteMessages
  }