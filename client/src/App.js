import { useEffect } from 'react'
import Notification from './components/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { logout, restoreUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { initializeBlogs } from './reducers/blogReducer'
import BlogList from './components/BlogList'

const App = () => {
	const user = useSelector((state) => state.user)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(restoreUser())
		dispatch(initializeBlogs())
	}, [])

	return (
		<div>
			<h2>{user === null ? 'Log in to application' : 'Blogs'}</h2>

			<Notification />

			{user === null ? (
				<LoginForm />
			) : (
				<>
					<div>
						<p>logged in as {user.name} </p>
						<button
							onClick={() => dispatch(logout())}
							className="login-toggle"
						>
							logout
						</button>
					</div>
					<BlogForm />
					<BlogList />
				</>
			)}
		</div>
	)
}

export default App
