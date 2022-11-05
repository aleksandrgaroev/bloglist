const LoginForm = (props) => (
	<form onSubmit={props.handleSubmit}>
		<div>
			username
			<input
				type="text"
				value={props.username}
				name="Username"
				onChange={props.handleUsernameChange}
			/>
		</div>
		<div>
			password
			<input
				type="password"
				value={props.password}
				name="Password"
				onChange={props.handlePasswordChange}
			/>
		</div>
		<button type="submit">login</button>
	</form>
)

export default LoginForm
