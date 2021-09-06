const {getuserRepo} = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const login = async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
      throw new BadRequestError('Please provide username and password')
    }

    var user = await getuserRepo(username)
    // user = Object.assign({}, user)
    if(!user){
        return res.status(401).json({ status: "fail", message: 'The username or password wrong' })
    }
    // Load hash from your password DB.

     const match = await bcrypt.compare(password, user.PASSWORD);
     if(match != true)return res.status(401).json({ status: "fail", message: 'The username or password wrong' })
    id = user.ID
    // bcrypt.compare(password,user.PASSWORD, function(err, result) {
    //     if(result != true)return res.status(401).json({ status: "fail", message: 'The username or password wrong' })
    //     console.log('success');
    // });

    // try to keep payload small, better experience for user
    // just for demo, in production use long, complex and unguessable string value!!!!!!!!!
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
    console.log(token);
    res.status(200).json({ msg: match})
    // res.status(200).json({ msg: 'user created', token })
  }

  module.exports = {
    login,
  }