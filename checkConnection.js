const oracledb = require('oracledb');
// hr schema password
// var password = '<PASSWORD>' 
// checkConnection asycn function
async function checkConnection() {
  try {
    connection = await oracledb.getConnection({
        user: 'course2',
        password: 'course2#',
        connectString: '100.100.100.19:1522/TIRGUL'
    });
    console.log('connected to database');
  } catch (err) {
    console.error(err.message);
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
  }
}

// checkConnection();
module.exports = checkConnection