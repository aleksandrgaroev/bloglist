import { useRef, useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import useNotification from '../hooks/useNotification'
import { useDispatch } from 'react-redux'
import Togglable from './Togglable'

const BlogForm = () => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')
	const notify = useNotification(5000)
	const dispatch = useDispatch()

	const ref = useRef()

	const clearInputs = () => {
		setTitle('')
		setAuthor('')
		setUrl('')
	}
	const handleSubmit = (event) => {
		event.preventDefault()
		try {
			dispatch(createBlog({ title, author, url }))
			notify(`a new blog ${title} by ${author} added`)
			clearInputs()
			// ref.toggleVisibility()
		} catch (exception) {
			notify('error adding blog', 'alert')
			console.log(exception)
		}
	}
	return (
		<div>
			<h2>create new</h2>
			<Togglable buttonLabel="new blog" ref={ref}>
				<form onSubmit={handleSubmit}>
					<div>
						title:
						<input
							value={title}
							id="title"
							name="Password"
							onChange={({ target }) => setTitle(target.value)}
						/>
					</div>
					<div>
						author:
						<input
							id="author"
							value={author}
							name="author:"
							onChange={({ target }) => setAuthor(target.value)}
						/>
					</div>
					<div>
						url:
						<input
							id="url"
							value={url}
							name="url"
							onChange={({ target }) => setUrl(target.value)}
						/>
					</div>

					<button type="submit" id="create-button">
						create
					</button>
				</form>
			</Togglable>
		</div>
	)
}

export default BlogForm
