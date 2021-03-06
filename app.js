const express = require('express')
require('dotenv').config()
const oracledb = require('oracledb'); 
const messages = require('./routes/messages')
const login = require('./routes/login')
const middleware = require('./middleware/middleware')
const {asyncMiddleware} = require('middleware-async')

const checkConnection = require('./checkConnection')

const PORT = process.env.PORT || 8080

const app = express()

try {
    oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_12'});
  } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }

app.use(express.urlencoded({extended:false}))
app.use(express.json())

// app.use(asyncMiddleware(async (req, res, next) => {
  
// }))
app.use('/api/messages', messages)
app.use('/api/login', login)

app.use(async (req, res, next) => {
  await middleware(req, res, next);
})


app.listen(PORT,(req,res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

