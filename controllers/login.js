const {getuserRepo} = require("../models/user");
const bcrypt = require('bcrypt');
var crypto = require("crypto");
const redis = require('redis');
const client = redis.createClient(6379 , '100.100.100.101');

client.on('connect', function() {
    console.log('Connected!');
  });

const login = async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
      throw new BadRequestError('Please provide username and password')
    }

    try {
        var user = await getuserRepo(username)
        // user = Object.assign({}, user)
        if(!user){
            return res.status(401).json({ status: "fail", message: 'The username or password wrong' })
        }
        // Load hash from your password DB.
    
         const match = await bcrypt.compare(password, user.PASSWORD);
         if(match != true)return res.status(401).json({ status: "fail", message: 'The username or password wrong' })
        id = user.ID

        const token = crypto.randomBytes(15).toString('hex');
    
        // const token = jwt.sign(
        //     { user_id: id, username },
        //     process.env.TOKEN_KEY,
        //     {
        //       expiresIn: "2h",
        //     }
        //   );
    
        client.set({tokens:token}, id, function(err, reply) {
            console.log(reply); // OK
          });
    
    
        console.log(token);
        return res.status(200).json({ status: "ok", payload:token  })
    } catch (error) {
        return res.status(400).json({ status: "fail", message: 'login failed' })
    }
  }

  module.exports = {
    login,
  }