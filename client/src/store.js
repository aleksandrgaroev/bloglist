import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
	reducer: {
		blogs: blogReducer,
		notification: notificationReducer,
		user: userReducer,
	},
})

export default store
