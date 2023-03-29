import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
	const mockHandler = jest.fn()

	const blog = {
		title: 'Test title',
		author: 'Test author',
		url: 'Test url',
		user: {
			username: 'Test username',
		},
		likes: 0,
	}
	const user = {
		username: 'Test username',
	}

	let container

	beforeEach(() => {
		container = render(
			<Blog blog={blog} user={user} likeBlog={mockHandler} />,
		).container
	})

	test('renders title and author', () => {
		const title = container.querySelector('.title')
		const author = container.querySelector('.author')
		const url = container.querySelector('.url')
		const likes = container.querySelector('.likes')

		expect(title).toHaveTextContent('Test title')
		expect(author).toHaveTextContent('Test author')
		expect(url).toBeNull()
		expect(likes).toBeNull()
	})

	test('renders url and likes when view button is clicked', async () => {
		const user = userEvent.setup()
		const button = container.querySelector('.visibility-toggle')
		await user.click(button)

		const url = container.querySelector('.url')
		const likes = container.querySelector('.like-text')

		expect(url).toHaveTextContent('Test url')
		expect(likes).toHaveTextContent('likes 0')
	})

	test('like button is clicked twice, event handler is called twice', async () => {
		const user = userEvent.setup()
		const button = container.querySelector('.visibility-toggle')
		await user.click(button)

		const likeButton = container.querySelector('.like-button')
		await user.click(likeButton)
		await user.click(likeButton)

		expect(mockHandler.mock.calls).toHaveLength(2)
	})
})
