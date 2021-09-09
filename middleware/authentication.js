const redis = require('redis');
const client = redis.createClient(6379 , '100.100.100.101');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

client.on('connect', function() {
    console.log('Connected!');
  });

const verifyToken = async (req, res, next) => {
    if ( req.path == '/api/login') return next();
    const token = req.headers.authorization || req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({ status: "fail", message: "A token is required for authentication" })
    }
    try {
        var tokenWithoutBearer = token.substring(7)
        const tokenValueFromRedis = await client.getAsync(tokenWithoutBearer);
        if(!tokenValueFromRedis)return res.status(401).json({ status: "fail", message: "Invalid Token" })

    } catch (err) {
      return res.status(401).json({ status: "fail", message: "Invalid Token" })
    }
    return next();
  };
  
  module.exports = verifyToken;