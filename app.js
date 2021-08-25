const express = require('express')
require('dotenv').config()
const oracledb = require('oracledb'); 
const messages = require('./routes/messages')

const PORT = process.env.PORT || 8080

const app = express()

let connection;

try {
    oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_12'});
  } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }

(async function(){

    try{
        connection = await oracledb.getConnection({
            user: 'course2',
            password: 'course2#',
            connectString: '100.100.100.19:1522/TIRGUL'
            // connectString: 'hostname:portname/servicename'
        });

        console.log("Successfully connected");
    } catch(err){
        console.log("NOT connected");
    }finally{
        if(connection){
            try{
                await connection.close();
            }catch(err){
                console.log("Errror");
            }
        }
    }
})()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/api/messages', messages)


app.listen(PORT,(req,res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})