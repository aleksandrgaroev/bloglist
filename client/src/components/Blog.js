import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
    const [isContentVisible, setIsContentVisible] = useState(false)
    const toggleContentVisibility = () => {
        setIsContentVisible(!isContentVisible)
    }
    const contentVisibility = { display: isContentVisible ? '' : 'none' }


    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return <div style={blogStyle}>
        <div>
            {blog.title} {blog.author}
            <button onClick={toggleContentVisibility}>{isContentVisible ? 'hide' : 'view'}</button>
        </div>
        <div style={contentVisibility}>
            <div>
                <a>{blog.url}</a>
            </div>
            <div>
                likes {blog.likes}
                <button onClick={() => likeBlog(blog.id, blog)}>like</button>
            </div>
            <div>{blog.user.username}</div>
            {user.username === blog.user.username ?
                <div>
                    {<button onClick={() => removeBlog(blog.id, blog.title, blog.author)}>remove</button>}
                </div> : <></>}
        </div>
    </div>
}

export default Blog