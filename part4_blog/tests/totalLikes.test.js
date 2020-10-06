const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithOneBlog = [
        {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
        }
    ]

    const listWithMultipleBlogs = [
        {
            _id: '5a312hj91b24d675222c17d3',
            title: 'What is love?',
            author: 'Haddaway',
            url: 'http:www.youtube.com',
            likes: 100,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '3a312ha91b24d675df2c17d3',
            title: 'Never gonna give you up',
            author: 'Rick Astley',
            url: 'http:www.youtube.com',
            likes: 50,
            __v: 0
        }
    ]

    const emptyList = []
    
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
    test('when list has multiple blogs, test returns total likes from all of them', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        expect(result).toBe(155)
    })
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })
    })

  