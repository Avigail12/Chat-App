const express = require('express')
const oracledb = require('oracledb');
const crypto = require("crypto");
const dbConfig = require("../dbConfig");
const router = express.Router();
const {
    login,
  } = require('../controllers/login')

router.route('/').post(login)

module.exports = router