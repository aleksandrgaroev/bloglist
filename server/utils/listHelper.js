const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	if (!blogs || blogs.length === 0) return 0
	return blogs.reduce((prev, curr) => prev + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
	if (!blogs || blogs.length === 0) return {}
	const favoriteBlog = blogs.reduce((prev, curr) => {
		return prev.likes > curr.likes ? prev : curr
	})
	const formatedFavoriteBlog = {
		title: favoriteBlog.title,
		author: favoriteBlog.author,
		likes: favoriteBlog.likes,
	}
	return formatedFavoriteBlog
}

const mostBlogs = (blogs) => {
	if (!blogs || blogs.length === 0) return {}

	const authorWithMostBlogs = blogs.reduce(
		({ authors, most }, { author }) => {
			authors[author] = authors[author] || 0
			authors[author]++
			if (authors[author] > most.blogs) {
				most = { author, blogs: authors[author] }
			}
			return { authors, most }
		},
		{ authors: {}, most: { author: '', blogs: 0 } }
	).most

	return authorWithMostBlogs
}

const mostLikes = (blogs) => {
	if (!blogs || blogs.length === 0) return {}

	const authorWithMostLikes = blogs.reduce(
		({ authors, most }, { author, likes }) => {
			authors[author] = authors[author] || 0
			authors[author] += likes
			if (authors[author] > most.likes) {
				most = { author, likes: authors[author] }
			}
			return { authors, most }
		},
		{ authors: {}, most: { author: '', likes: 0 } }
	).most

	return authorWithMostLikes
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
}
