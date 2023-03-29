import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
	const [isContentVisible, setIsContentVisible] = useState(false)
	const toggleContentVisibility = () => {
		setIsContentVisible(!isContentVisible)
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
							onClick={() => likeBlog(blog.id, blog)}
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
										removeBlog(
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
