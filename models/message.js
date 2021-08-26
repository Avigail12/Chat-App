// const oracledb = require('oracledb');
// const checkConnection = require('../checkConnection')

// async function create(mess) {
//     const message = Object.assign({}, mess);
//     checkConnection.
//     message.key = {
//       dir: oracledb.BIND_OUT,
//       type: oracledb.NUMBER
//     }
 
//     const result = await database.simpleExecute(createSql, message);
  
//     // employee.employee_id = result.outBinds.employee_id[0];
  
//     return message;
//   }

//   const createSql =
//  'insert into MESSAGES (FROM_NAME,TO_NAME,MESSAGE,CREATED_AT,UPDATED_AT,KEY) values (:FROM_NAME,:TO_NAME,:MESSAGE,:CREATED_AT,:UPDATED_AT,:KEY,)' 
// //  returning employee_id
// //   into :employee_id';

// module.exports.create = create;


app.post('/process_post', function (req, res) {

    console.log("contenttype"+req.get('Content-Type'))
    
     
    
      doGetConnection(res, function(err, connection) {
    
        if (err)
    
          return;
    
        connection.execute(
    
          "INSERT INTO TEST_TABLE VALUES (:s,:p)",
    
     
    
          { s: JSON.stringify(req.body) },
    
      { p: JSON.stringify(req.body) },
    
      console.log("check1"),
    
          { autoCommit: true },
    
       console.log("check2"),
    
          function (err) {
    
      console.log("check3");
    
            if (err) {
    
    console.log("check4");
    
              res.set('Content-Type', 'application/json');
    
              res.status(400).send(JSON.stringify({
    
                status: 400,
    
                message: "Input Error",
    
                detailed_message: err.message
    
              }));
    
            } else {
    
              // Successfully created the resource
    
              res.status(201).set('Location', '/process_post/' + req.body.FIRST_NAME+req.body.LAST_NAME).end();
    
     
    
            }
    
            doRelease(connection, "POST /process_post");
    
          });
    
      });
    
    });