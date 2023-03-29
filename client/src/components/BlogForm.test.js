import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
	test('check what event handler receives correct props as arguments', async () => {
		const createBlog = jest.fn()
		const user = userEvent.setup()

		render(<BlogForm createBlog={createBlog} />)

		const inputs = screen.getAllByRole('textbox')
		const title = inputs[0]
		const author = inputs[1]
		const url = inputs[2]
		const submit = screen.getByRole('button')

		await user.type(title, 'Test title')
		await user.type(author, 'Test author')
		await user.type(url, 'Test url')
		await user.click(submit)

		expect(createBlog.mock.calls).toHaveLength(1)
		expect(createBlog.mock.calls[0][0]).toBe('Test title')
		expect(createBlog.mock.calls[0][1]).toBe('Test author')
		expect(createBlog.mock.calls[0][2]).toBe('Test url')
	})
})
