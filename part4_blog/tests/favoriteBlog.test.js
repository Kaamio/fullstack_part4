const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {        

    const blogs = [
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
        },
        {
            _id: '8a312hj91b54s6752452c17d3',
            title: 'Africa',
            author: 'ToTo',
            url: 'http:www.youtube.com',
            likes: 100,
            __v: 0
        }
    ]

    const empty_bloglist = []

    test('favorite blog is returned', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[0])
    })
    test('returns 0 if list is empty', () => {
        const result = listHelper.favoriteBlog(empty_bloglist)
        expect(result).toBe(0)
    })
    
})