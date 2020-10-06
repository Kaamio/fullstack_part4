const _ = require("lodash")

const dummy = (blogs) => {
    return 1
  }


const totalLikes = (array) => {

  const nums = array.map(num => {
    return Number(num.likes)
  }) 
    
    const reducer = (sum, likes) => {
        return sum+likes
    }
    return array.length === 0
      ? 0 
      : nums.reduce(reducer,0)
  }

  const favoriteBlog = (array) => {
    const likes = array.map(blog => {
      return Number(blog.likes)
    }) 

    return array.length === 0
    ? 0
    : array[likes.indexOf(Math.max(...likes))]
  }

  const mostBlogs = (array) => {      
    const mostBlogs = _.map(_.countBy(array,'author'),(val,key) => ({author: key, blogs:val}))     
   
    return array.length === 0
    ? 0
    : _(mostBlogs).maxBy('blogs')
  }

  const mostLikes = (array) => {    
    const mostPopular = _(array).groupBy('author').map((value, key) => ({author: key, likes: _.sumBy(value, 'likes')})).value()

    return array.length === 0
    ? 0
    : _(mostPopular).maxBy('likes') 
  }

  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes

  } 

 