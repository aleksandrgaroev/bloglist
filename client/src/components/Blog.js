import { useState } from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import useNotification from '../hooks/useNotification'

const Blog = ({ blog }) => {
	const [isContentVisible, setIsContentVisible] = useState(false)
	const dispatch = useDispatch()
	const user = useSelector((state) => state.user)
	const notify = useNotification(5000)
	const toggleContentVisibility = () => {
		setIsContentVisible(!isContentVisible)
	}

	const handleLike = (id) => {
		try {
			dispatch(likeBlog(id))
		} catch (exception) {
			notify('error liking blog', 'alert')
			console.log(exception)
		}
	}

	const handleDelete = (id, title, author) => {
		try {
			if (window.confirm(`Remove blog ${title} by ${author}`)) {
				dispatch(removeBlog(id))
			}
		} catch (exception) {
			notify('error deleting blog', 'alert')
		}
	}

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	}

	return (
		<div style={blogStyle} className="blog">
			<div>
				<div className="title">{blog.title}</div>
				<div className="author">{blog.author}</div>
				<button
					className="visibility-toggle"
					onClick={toggleContentVisibility}
				>
					{isContentVisible ? 'hide' : 'view'}
				</button>
			</div>
			{isContentVisible ? (
				<div className="content">
					<div className="url">
						<a>{blog.url}</a>
					</div>
					<div className="like">
						<span className="like-text">
							likes{' '}
							<span className="like-counter">{blog.likes}</span>
						</span>
						<button
							className="like-button"
							onClick={() => handleLike(blog.id)}
						>
							like
						</button>
					</div>
					<div className="username">{blog.user.username}</div>
					{user.username === blog.user.username ? (
						<div>
							{
								<button
									className="delete-button"
									onClick={() =>
										handleDelete(
											blog.id,
											blog.title,
											blog.author,
										)
									}
								>
									remove
								</button>
							}
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	)
}

export default Blog
