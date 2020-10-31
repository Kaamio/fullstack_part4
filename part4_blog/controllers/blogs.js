const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async(request, response) => { 
  const bloglist = await Blog.find({}).populate('user', { username: 1, name: 1 })     
      response.json(bloglist.map(b => b.toJSON()))    
})

blogsRouter.get('/:id', async (request, response) => { 
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async(request, response) => {
  const body = request.body 
  
  if (!request.token) {
    response.status(401).json({ error: 'Authentication token missing!' }).end()
  }
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)  

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })


  if(!blog.likes) { blog.likes = 0 }
     
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())        
        
})

blogsRouter.put('/:id', async(request, response) => {
  
  const body = request.body
 
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  
    updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)   
    response.json(updatedBlog)
    })    

blogsRouter.delete('/:id', async(request, response) => {
const blog = await Blog.findById(request.params.id)

if (!blog) { 
  response.status(404).json({ error: 'Blog with the supplied id not found' })
}

if(!request.token) {
  response.status(401).json({ error: 'Authentication token missing!' })
}

const decodedToken = jwt.verify(request.token, process.env.SECRET)
const user = await User.findById(decodedToken.id) 

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }  
  else {
    response.status(401).json({ error: 'Cannot delete another users post!' })
  }
})

module.exports = blogsRouter