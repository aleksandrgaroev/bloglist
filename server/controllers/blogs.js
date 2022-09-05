const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({})
	res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
	const body = req.body

	const newBlog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
	}

	const blog = new Blog(newBlog)
	const returnedBlog = await blog.save()
	res.status(201).json(returnedBlog)
})

module.exports = blogsRouter
