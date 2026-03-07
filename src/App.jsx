import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

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

//login handler
  const handleLogin = async event => {
    event.preventDefault();
    console.log("logging in with", username, password)

    try {
      const user = await loginService.login({username, password})
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


  if(user === null) {
    return (
    <div>
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
        <h3>{user.name} logged in</h3>
      </div>)}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App