const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./testHelper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
	await Blog.deleteMany({})

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
	const promiseArray = blogObjects.map((blog) => blog.save())
	await Promise.all(promiseArray)
})

test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs')

	expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
	const response = await api.get('/api/blogs')

	const titles = response.body.map((blog) => blog.title)
	expect(titles).toContainEqual('First blog')
})

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('all blogs should have .id instead of _id', async () => {
	const response = await api.get('/api/blogs')

	const blogs = response.body

	for (let i = 0; i < blogs.length; i++) {
		expect(blogs[i].id).toBeDefined()
	}
})

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'Test blog',
		author: 'Test author',
		url: 'test url',
		likes: 2,
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

	const titles = blogsAtEnd.map((blog) => blog.title)
	expect(titles).toContain('Test blog')
})

test('blog without likes property will be defaulted to 0', async () => {
	const newBlog = {
		title: 'Test blog',
		author: 'Test author',
		url: 'test url',
	}

	const response = await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	expect(response.body.likes).toEqual('0')
})

test('missing title will return a 400 error code', async () => {
	const newBlog = {
		author: 'Test author',
		url: 'test url',
		likes: 4,
	}

	await api.post('/api/blogs').send(newBlog).expect(400)
})

test('missing url will return a 400 error code', async () => {
	const newBlog = {
		title: 'Alles klar',
		author: 'Test author',
		likes: 4,
	}

	await api.post('/api/blogs').send(newBlog).expect(400)
})


afterAll(() => {
	mongoose.connection.close()
})
