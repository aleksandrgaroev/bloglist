const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./testHelper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
	jest.setTimeout(60000);
	await Blog.deleteMany({})

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
	const promiseArray = blogObjects.map((blog) => blog.save())
	await Promise.all(promiseArray)
})

describe('when there is initially some notes saved', () => {
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

	describe('posting new blog', () => {
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
	})

	describe('viewing a specifin blog', () => {
		test('successful with a valid id', async () => {
			const blogsAtStart = await helper.blogsInDb()

			const blogToView = blogsAtStart[0]

			const resultBlog = await api
				.get(`/api/blogs/${blogToView.id}`)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

			expect(resultBlog.body).toEqual(processedBlogToView)
		})

		test('fails with statusCode 404 if blog does not exist', async () => {
			const validNonexistingId = await helper.nonExistingId()

			const response = await api
				.get(`/api/blogs/${validNonexistingId}`)
				.expect(404)

			expect(response.body).toEqual({ error: 'blog not found' })
		})

		test('fails with statusCode 400 id is invalid', async () => {
			const invalidId = '5a3d5da59070081a82a3445'

			await api.get(`/api/blogs/${invalidId}`).expect(400)
		})
	})

	describe('deleting a blog', () => {
		test('succeeds with statusCode 204 if id is valid', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToDelete = blogsAtStart[0]

			await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

			const blogsAtEnd = await helper.blogsInDb()

			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

			const titles = blogsAtEnd.map((r) => r.title)

			expect(titles).not.toContain(blogToDelete.title)
		})
	})

	describe('updating a blog', () => {
		test('successful with a valid id and only likes', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToUpdate = blogsAtStart[0]

			const updatedBlog = {
				title: blogToUpdate.title,
				author: blogToUpdate.author,
				url: blogToUpdate.url,
				likes: blogToUpdate.likes + 1,
				user: blogToUpdate.user,
			}

			const response = await api
				.put(`/api/blogs/${blogToUpdate.id}`)
				.send(updatedBlog)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			expect(response.body.likes).toBe(blogToUpdate.likes + 1)

			const responseFromServer = await api
				.get(`/api/blogs/${blogToUpdate.id}`)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			expect(responseFromServer.body.likes).toBe(blogToUpdate.likes + 1)
		})

		test('fails with statusCode 400 id is invalid', async () => {
			const invalidId = '5a3d5da59070081a82a3445'

			await api.put(`/api/blogs/${invalidId}`).expect(400)
		})
	})
})

afterAll(() => {
	mongoose.connection.close()
})
