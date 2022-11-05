const BlogForm = (props) => (
	<form onSubmit={props.handleSubmit}>
		<div>
			title:
			<input
				value={props.title}
				name="Password"
				onChange={props.handleTitleChange}
			/>
		</div>
		<div>
			author:
			<input
				value={props.author}
				name="author:"
				onChange={props.handleAuthorChange}
			/>
		</div>
		<div>
			url:
			<input
				value={props.url}
				name="url"
				onChange={props.handleUrlChange}
			/>
		</div>

		<button type="submit">create</button>
	</form>
)

export default BlogForm
