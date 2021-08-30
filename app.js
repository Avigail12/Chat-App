const express = require('express')
require('dotenv').config()
const oracledb = require('oracledb'); 
const messages = require('./routes/messages')

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
app.use('/api/messages', messages)


app.listen(PORT,(req,res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

