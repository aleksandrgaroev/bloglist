describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3003/api/testing/reset')
		const user = {
			name: 'Test User',
			username: 'testuser',
			password: 'testpassword',
		}
		const user2 = {
			name: 'Test User 2',
			username: 'testuser2',
			password: 'testpassword2',
		}
		cy.request('POST', 'http://localhost:3003/api/users/', user)
		cy.request('POST', 'http://localhost:3003/api/users/', user2)
		cy.visit('http://localhost:3000')
	})

	it('Login form is shown', function () {
		cy.contains('Log in to application')
	})

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.contains('log in').click()
			cy.get('input#username').type('testuser')
			cy.get('input#password').type('testpassword')
			cy.get('button#login-button').click()

			cy.contains('logged in as Test User')
		})
		it('fails with wrong credentials', function () {
			cy.contains('log in').click()
			cy.get('input#username').type('testuser')
			cy.get('input#password').type('nottestpassword')
			cy.get('button#login-button').click()

			cy.get('.error').should('contain', 'wrong username or password')
			cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
			cy.get('.error').should('have.css', 'border-style', 'solid')
		})
	})

	describe('When logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'testuser', password: 'testpassword' })
		})

		it('A blog can be created', function () {
			cy.contains('new blog').click()
			cy.get('input#title').type('Test Blog')
			cy.get('input#author').type('Test Author')
			cy.get('input#url').type('Test URL')
			cy.get('button#create-button').click()

			cy.contains('Test Blog')
		})

		describe('and a blog exists', function () {
			beforeEach(function () {
				cy.createBlog('Test Blog', 'Test Author', 'Test URL')
			})

			it('A blog can be liked', function () {
				cy.contains('view').click()
				cy.get('button.like-button').click()
				cy.contains('likes 1')
			})
			it('A blog can be deleted', function () {
				cy.contains('view').click()
				cy.get('button.delete-button').click()
				cy.contains('Test Blog').should('not.exist')
			})
			it('Another user cannot delete a blog', function () {
				cy.login({ username: 'testuser2', password: 'testpassword2' })
				cy.contains('view').click()
				cy.get('button.delete-button').should('not.exist')
			})
		})
		describe('and multiple blogs exist', function () {
			beforeEach(function () {
				cy.createBlog(
					'The title with least likes',
					'Test Author 1',
					'Test URL 1',
				)
				cy.createBlog(
					'The title with the second most likes',
					'Test Author 2',
					'Test URL 2',
				)
				cy.createBlog(
					'The title with the most likes',
					'Test Author 3',
					'Test URL 3',
				)
			})

			it('Blogs are ordered by likes', function () {
				cy.contains('The title with the most likes')
					.parent()
					.find('button.visibility-toggle')
					.click()
				cy.contains('The title with the most likes')
					.parent()
					.parent()
					.find('button.like-button')
					.click()
				cy.contains('The title with the most likes')
					.parent()
					.parent()
					.find('button.like-button')
					.click()
				cy.contains('The title with the most likes')
					.parent()
					.parent()
					.find('button.like-button')
					.click()

				cy.contains('The title with the second most likes')
					.parent()
					.find('button.visibility-toggle')
					.click()
				cy.contains('The title with the second most likes')
					.parent()
					.parent()
					.find('button.like-button')
					.click()

				cy.get('.blog')
					.eq(0)
					.should('contain', 'The title with the most likes')
				cy.get('.blog')
					.eq(1)
					.should('contain', 'The title with the second most likes')
			})
		})
	})
})
