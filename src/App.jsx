import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/newBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token)
    }
  }, []);

//login handler
  const handleLogin = async event => {
    event.preventDefault();
    console.log("logging in with", username, password)

    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }

  //logout handler
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser');
    setUser(null);
  }

  //create new blog handler
  const CreateBlog = async blogObject => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
  }
 
  if(user === null) {
    return (
    <div>
       <Notification message={errorMessage} />
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>username <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} /></label>
          </div>
          <div>
            <label>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></label>
          </div>
          <button type="submit">login</button>
        </form>
    </div>
  )}

  
  return (
    <div>
       <Notification message={errorMessage} />
      <h2>blogs</h2>
      {user && (<div>
        <h3>{user.name} logged in <button onClick={handleLogout}>logout</button></h3> 
        <BlogForm CreateBlog={CreateBlog} />
      </div>)}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App