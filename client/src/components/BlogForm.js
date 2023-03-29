import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const clearInputs = () => {
		setTitle('')
		setAuthor('')
		setUrl('')
	}
	const handleSubmit = (event) => {
		event.preventDefault()
		createBlog(title, author, url)
		clearInputs()
	}
	return (
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
	)
}

export default BlogForm
