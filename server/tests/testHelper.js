const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title: 'First blog',
		author: 'derLetzte',
		url: 'google.com',
		likes: 8,
	},
	{
		title: 'Second blog',
		author: 'derErste',
		url: 'yandex.ru',
		likes: 3,
	},
]

const nonExistingId = async () => {
	const blog = new Blog({
		title: 'will be removed',
		author: 'gg',
		url: 'google.com.ua',
		likes: 10101010,
	})
	await blog.save()
	await blog.remove()

	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map((user) => user.toJSON())
}

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
	usersInDb,
}
