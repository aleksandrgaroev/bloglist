import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
	name: 'blogs',
	initialState: [],
	reducers: {
		setBlogs(state, action) {
			return action.payload
		},
		appendBlog(state, action) {
			state.push(action.payload)
		},
		updateBlog(state, action) {
			const id = action.payload.id
			const updatedBlog = action.payload.updatedBlog
			return state.map((blog) => (blog.id === id ? updatedBlog : blog))
		},
		deleteBlog(state, action) {
			const id = action.payload
			return state.filter((blog) => blog.id !== id)
		},
	},
})

export const { appendBlog, setBlogs, updateBlog, deleteBlog } =
	blogSlice.actions

export const initializeBlogs = () => {
	return async (dispatch) => {
		const blogs = await blogService.getAll()
		dispatch(setBlogs(blogs))
	}
}

export const likeBlog = (id) => {
	return async (dispatch) => {
		const blogs = await blogService.getAll()
		const blogToChange = blogs.find((blog) => blog.id === id)
		const changedBlog = {
			title: blogToChange.title,
			author: blogToChange.author,
			url: blogToChange.url,
			id: blogToChange.id,
			likes: Number(blogToChange.likes) + 1,
		}
		const updatedBlog = await blogService.update(id, changedBlog)
		console.log(updatedBlog)
		dispatch(updateBlog({ id, updatedBlog }))
	}
}

export const createBlog = (blog) => {
	return async (dispatch) => {
		const newBlog = await blogService.create(blog)
		dispatch(appendBlog(newBlog))
	}
}

export const removeBlog = (id) => {
	return async (dispatch) => {
		await blogService.remove(id)
		dispatch(deleteBlog(id))
	}
}

export default blogSlice.reducer
