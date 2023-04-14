import Blog from './Blog'
import { useSelector } from 'react-redux'

const BlogList = () => {
	const blogs = useSelector((state) => state.blogs)
	const sortedBlogs = blogs
		.slice()
		.sort((a, b) => Number(b.likes) - Number(a.likes))

	return (
		<div className="blogs">
			{sortedBlogs.map((blog) => (
				<Blog key={blog.id} blog={blog} />
			))}
		</div>
	)
}

export default BlogList
