const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title : "eka blogi",
        author:"m.k",
        url : "fff",
        likes: 2      
        
    },
    {
        title :  "toka blogi",
        author  :    "m.k.a",
        url   :    "Ei hassumpaa",
        likes  :    6        
    },
    {
        title  :  "kolmas blogi",
        author :  "m.k",
        url :   "Om mane anas hum",
        likes  :    10        
    }
  ]

  const initialUsers = [
    {
      username: 'Xxx_make_Xxx',
      name: 'make',
      password: 'ukulele'
    },
    {
      username: 'lll_ooo',
      name: 'pasi',
      password: 'bingo'
    }

  ]
 
  
  const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user=>user.toJSON())
  }

  module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDB,
    usersInDB
  }