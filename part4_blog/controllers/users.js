const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { request, response } = require('express')

usersRouter.post('/', async(request, response) => {
    const body = request.body

    const saltRounds = 10 
    const passwordHash = await bcrypt.hash(body.password , saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
   
    const user_in_db =  User.find({})
    const usernames = user_in_db.map(u => u.username)

    if (user.username in usernames) {
        response.status(400).json({error: 'username must be unique!'})
    }
    
    const savedUser = await user.save()
    response.json(savedUser.toJSON())     
    //response.status(400).json({ error: 'Username or name invalid!'})
      

    
})

usersRouter.get('/', async(request, response) => {
    const userlist = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
    response.json(userlist.map(u => u.toJSON()))
})


module.exports = usersRouter