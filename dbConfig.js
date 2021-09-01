require('dotenv').config()

module.exports = {
    user: process.env.DB_USER,/*'course2',*/
    password: process.env.DB_PASS,/*'course2#',*/
    connectString : process.env.DB_CONNECTSTRING/*'100.100.100.19:1522/TIRGUL',*/
  
    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://oracle.github.io/node-oracledb/doc/api.html#extauth
    // externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };