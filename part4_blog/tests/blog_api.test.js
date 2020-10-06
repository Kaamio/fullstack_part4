const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const usersRouter = require('../controllers/users')
const { initialUsers, initialBlogs, blogsInDB } = require('./test_helper')

const api = supertest(app)

const initialuser = {
  username: 'postwithtoken',
  name: 'testimake',
  password: 'ukulele'
 } 

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)

    await api
    .post('/api/users')
    .send(initialuser)
    .expect(200)
    .expect('Content-Type', /application\/json/) 
  })

describe('When initial notes are added', () => {    

test('there are three blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(3)
  })

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
test('blogs have and id-field', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.id)   

    contents.forEach(element => expect(element).toBeDefined())     
  })
})

describe('When blogs are added', () => {   

test('a valid blog can be added ', async () => { 

   const user = {
    username: 'postwithtoken',    
    password: 'ukulele'
  }  
  
  const credentials = await api
  .post('/api/login')
  .send(user)
  .expect(200)
  .expect('Content-Type', /application\/json/) 
  
 
  const newBlog = {
      title: 'Ei huono',
      author: 'Alfred J. Kwak',
      url: 'T.T',
      likes: 300           
    }    
    
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${credentials.body.token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/) 
      

    const blogsAfterPost = await helper.blogsInDB()
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1 )
    
    const contents = blogsAfterPost.map(n => n.title)    
    expect(contents).toContain(
      'Ei huono'
    )
  })
  
  test('each blog needs a value for likes, otherwise it is set at 0', async () => {    
      
     const user = {
      username: 'postwithtoken',    
      password: 'ukulele'
    }  
    
    const credentials = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'No likes',
      author: 'Alfred J. Kwak',
      url: 'T.T',
      likes: NaN      
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${credentials.body.token}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDB()

    const blog = blogsAtEnd.find(n => n.content === newBlog.content)

    expect(blog.likes === 0)
  })

  test('each blog needs to have title and url', async () => {    
  
     const user = {
      username: 'postwithtoken',    
      password: 'ukulele'
    }  
    
    const credentials = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)


    const newBlog = {
      title: 'Ei huono',
      author: 'Alfred J. Kwak',
      url: NaN,
      likes: 300      
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${credentials.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('Blog cannot be added without oauth-token', async () => {  
    
    const blognotoken = {
      title: 'blog_1',
      author: 'testuser',
      url: 'www.fi',
      likes: 30      
    }

    const response = await api
      .post('/api/blogs')      
      .send(blognotoken)
      .expect(401)   

  })
})
describe('When blogs are deleted', () => {

  test('Amount of blogs decreases by one', async () => {
    const blogsAtStart = await helper.blogsInDB()
    
    
    const user = {
      username: 'postwithtoken',    
      password: 'ukulele'
    }  

    const blog_to_del = {
      title: 'to_delete',
      author: 'user',
      url: 'xop',
      likes: 100  
    }
    
    const credentials = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/) 

    const posted_note = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${credentials.body.token}`)
    .send(blog_to_del)
    .expect(200)
    .expect('Content-Type', /application\/json/) 

       
    await api
    .delete(`/api/blogs/${posted_note.body.id}`)
    .set('Authorization', `bearer ${credentials.body.token}`)
    .expect(204)


    const blogsAfterDelete = await helper.blogsInDB()
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)
    
    const title = blogsAfterDelete.map(r => r.title)
  
    expect(title).not.toContain(blog_to_del.title)    
})  



describe('When users are added', () => {
  test('a valid user can be added ', async () => {
      
    const newUser = {
        username: 'Testuser',
        name: 'Tester',
        password: 'test'           
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/) 
        
  
      const usersAfterPost = await helper.usersInDB()
      expect(usersAfterPost).toHaveLength(helper.initialUsers.length + 2)
      
      const usernames = usersAfterPost.map(n => n.username)    
      expect(usernames).toContain(
        'Testuser'
      )
    })

    test('User with Invalid (too short) username cannot be created', async() => {
      
      const InvalidUser = {
        username: 'er',
        name: 'Testi',
        password: 'test'           
      }

      await api
        .post('/api/users')
        .send(InvalidUser)
        .expect(400)  
      
    }) 

    test('User with Invalid (too short) name cannot be created', async() => {
      
      const InvalidUser = {
        username: 'CorrectUser',
        name: 'er',
        password: 'testisalasana'           
      }

      const result = await api
        .post('/api/users')
        .send(InvalidUser)
        .expect(400) 

              
    }) 

    test('Username has to be unique', async() => {
      
      const InvalidUser = {
        username: 'lll_ooo',
        name: 'nimi',
        password: 'testisalasana'           
      }

      const result = await api
        .post('/api/users')
        .send(InvalidUser)
        .expect(400)      
      expect(result.body.error).toContain('`username` to be unique')              
    }) 

  })

afterAll(() => {
  mongoose.connection.close()
})

})

  