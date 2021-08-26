const express = require('express')
require('dotenv').config()
const oracledb = require('oracledb'); 
const messages = require('./routes/messages')

const checkConnection = require('./checkConnection')

const PORT = process.env.PORT || 8080

const app = express()

// let connection;

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

// (async function(){

//     try{
//         connection = await oracledb.getConnection({
//             user: 'course2',
//             password: 'course2#',
//             connectString: '100.100.100.19:1522/TIRGUL'
//             // connectString: 'hostname:portname/servicename'
//         });

//         console.log("Successfully connected");
//     } catch(err){
//         console.log("NOT connected");
//     }finally{
//         if(connection){
//             try{
//                 await connection.close();
//             }catch(err){
//                 console.log("Errror");
//             }
//         }
//     }
// })()




// async function run() {

//   let connection;

//   try {
//     // 100.100.100.19:1522/TIRGUL
//     connection = await oracledb.getConnection({ user: "course2", password: "course2#", connectionString: "100.100.100.19:1522/TIRGUL" });

//     // connection.commit();

//     // Now query the rows back

//     result = await connection.execute(
//       `select MESSAGE from MESSAGES`,
//       [],
//       { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

//     const rs = result.resultSet;
//     let row;
//     console.log('result');
//         console.log(rs.getRow());
//     while ((row = await rs.getRow())) {
//         console.log(row.MESSAGE);
//       if (row.id)
//         console.log(row.MESSAGE, "is done");
//       else
//         console.log(row.MESSAGE, "is NOT done");
//     }

//     await rs.close();

//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }

// run();