const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
		author: 1,
	})
	res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
	const body = req.body

	const user = req.user

	if (!user) {
		return res.status(201).json({ error: 'token missing or invalid' })
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: Number(body.likes) || 0,
		user: user._id,
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	res.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (req, res) => {
	const id = req.params.id
	const blog = await Blog.findById(id)

	if (blog) {
		res.json(blog.toJSON())
	} else {
		res.status(404).json({ error: 'blog not found' })
	}
})

blogsRouter.delete('/:id', async (req, res) => {
	const id = req.params.id

	const user = req.user

	if (!user) {
		return res.status(201).json({ error: 'token missing or invalid' })
	}

	const blog = await Blog.findById(id)

	if (blog.user.toString() === user._id.toString()) {
		await Blog.findByIdAndRemove(id)
		return res.status(204).end()
	}
	return res
		.status(401)
		.json({ error: 'You should be the author of a blog to delete it' })
})

blogsRouter.put('/:id', async (req, res, next) => {
	const id = req.params.id
	const body = req.body

	const blog = await Blog.findById(id)

	if (!blog) {
		return res.status(400).json({ error: 'blog not found' })
	}

	if (!user) {
		return res.status(201).json({ error: 'token missing or invalid' })
	}

	const newBlog = {
		title: body.title || blog.title,
		author: body.author || blog.author,
		url: body.url || blog.url,
		likes: Number(body.likes) || blog.likes,
		user: user._id,
	}
	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
		new: true,
	})
	res.json(updatedBlog)
})


module.exports = blogsRouter
