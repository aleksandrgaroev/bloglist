import { login } from '../reducers/userReducer'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useNotification from '../hooks/useNotification'
import Togglable from './Togglable'

const LoginForm = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const dispatch = useDispatch()
	const notify = useNotification(5000)

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			dispatch(login({ username, password }))
			setUsername('')
			setPassword('')
		} catch (exception) {
			notify('wrong username or password', 'alert')
		}
	}

	return (
		<Togglable buttonLabel="log in">
			<div>
				<form onSubmit={handleLogin}>
					<div>
						username
						<input
							id="username"
							type="text"
							value={username}
							name="Username"
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div>
						password
						<input
							id="password"
							type="password"
							value={password}
							name="Password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button type="submit" id="login-button">
						login
					</button>
				</form>
			</div>
		</Togglable>
	)
}
export default LoginForm
