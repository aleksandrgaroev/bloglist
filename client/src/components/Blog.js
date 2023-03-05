import {useState} from "react";

const Blog = ({blog, likeBlog}) => {
    const [isContentVisible, setIsContentVisible] = useState(false)

    const toggleContentVisibility = () => {
        setIsContentVisible(!isContentVisible)
    }
    const contentVisibility = {display: isContentVisible ? '' : 'none'}


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
                <button onClick={() => likeBlog(blog.id)}>like</button>
            </div>
            <div>{blog.user.username}</div>
        </div>
    </div>
}

export default Blog