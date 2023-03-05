import {useEffect, useRef, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notification, setNotification] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()

    const notify = (message, type = 'info') => {
        setNotification({message, type})
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    useEffect(() => {
        blogService.getAll().then((blogs) => {
            const sortedBlogs = blogs.sort((a, b) => Number(b.likes) - Number(a.likes))
            setBlogs(sortedBlogs)
        })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            console.log(user)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username,
                password,
            })
            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user),
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            notify('wrong username or password', 'alert')
        }
    }

    const logout = () => {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.clearToken()
    }

    const createBlog = async (title, author, url) => {
        blogFormRef.current.toggleVisibility()
        try {
            const blog = await blogService.create({title, author, url})
            const blogWithUsername = {...blog, user}
            setBlogs(blogs.concat(blogWithUsername))
            notify(`a new blog ${blog.title} by ${blog.author} added`)
        } catch (exception) {
            notify('error adding blog', 'alert')
            console.log(exception)
        }
    }

    const likeBlog = async (id) => {
        try {
            const blog = await blogService.getOne(id)
            const blogWithIncrementedLikes = {
                title: blog.title, author: blog.author, url: blog.url,
                likes: Number(blog.likes) + 1
            }
            console.log(blog, blogWithIncrementedLikes)
            const updatedBlog = await blogService.update(id, blogWithIncrementedLikes)
            const newBlogs = blogs.map((blog) => {
                if (blog.id === id) {
                    return updatedBlog
                }
                return blog
            })
            const sortedBlogs = newBlogs.sort((a, b) => Number(b.likes) - Number(a.likes))
            setBlogs(sortedBlogs)
        } catch (exception) {
            notify('error liking blog', 'alert')
            console.log(exception)
        }
    }

    const blogForm = () => (
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
                createBlog={createBlog}
            />
        </Togglable>
    )

    const loginForm = () => {
        return (
            <Togglable buttonLabel="log in">
                <LoginForm
                    handleSubmit={handleLogin}
                    handleUsernameChange={({target}) =>
                        setUsername(target.value)
                    }
                    username={username}
                    password={password}
                    handlePasswordChange={({target}) =>
                        setPassword(target.value)
                    }
                />
            </Togglable>
        )
    }

    return (
        <div>
            <h2>{user === null ? 'log in to application' : 'blogs'}</h2>

            <Notification notification={notification}/>

            {user === null ? (
                loginForm()
            ) : (
                <>
                    <div>
                        <p>logged in as {user.name} </p>
                        <button onClick={logout}>logout</button>
                    </div>
                    <div>
                        <h2>create new</h2>
                        {blogForm()}
                        {blogs.map((blog) => (
                            <Blog key={blog.id} blog={blog} likeBlog={likeBlog}/>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default App
