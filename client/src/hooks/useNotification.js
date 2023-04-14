import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
	removeNotification,
	setNotification,
} from '../reducers/notificationReducer'

const useNotification = (timeToDisplay) => {
	const [timeoutId, setTimeoutId] = useState(null)
	const dispatch = useDispatch()

	return (message, type = 'info') => {
		dispatch(setNotification({ message, type }))
		clearTimeout(timeoutId)
		setTimeoutId(
			setTimeout(() => {
				dispatch(removeNotification())
			}, timeToDisplay),
		)
	}
}

export default useNotification
