const { debug, timeStamp } = require('console');
const express = require('express')
const oracledb = require('oracledb');
const crypto = require("crypto");
const dbConfig = require("../dbConfig");
const { json } = require('express');
const router = express.Router();
const {
    getAllMessages,
    getMessage,
    createMessages,
    deleteMessages,
  } = require('../controllers/messages')


  router.route('/').get(getAllMessages)

  router.route('/:key').get(getMessage)

  router.route('/').post(createMessages)

  router.route('/:key').delete(deleteMessages)

module.exports = router
