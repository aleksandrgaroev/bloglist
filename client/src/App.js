import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);

  const notify = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      console.log(user);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      notify("wrong username or password", "alert");
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.clearToken();
  };

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const blog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(blog));
      setTitle("");
      setAuthor("");
      setUrl("");
      notify(`a new blog ${blog.title} by ${blog.author} added`);
    } catch (exception) {
      notify("error adding blog", "alert");
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={title}
          name="Password"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          value={author}
          name="author:"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>

      <button type="submit">create</button>
    </form>
  );

  return (
    <div>
      <h2>{user === null ? "log in to application" : "blogs"}</h2>

      <Notification notification={notification} />

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
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
