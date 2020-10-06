const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('express')

loginRouter.post('/', async (request,response)=> {
    const body = request.body

    const user = await User.findOne({username : body.username})
    const passok = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passok)) {
        return response.status(401).json({ error: 'invalid username or password'})
    }    

    const tokenuser = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(tokenuser, process.env.SECRET)
    response.status(200)
    .send({token, username : user.username, name: user.name})
})
    module.exports = loginRouter