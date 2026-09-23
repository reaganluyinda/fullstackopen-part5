import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/newBlog'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //login handler
  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setErrorMessage({ 'text': 'Welcome, ' + user.name, 'type': 'success' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage({ 'text': 'Wrong username or password', 'type': 'error' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  //logout handler
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  //create new blog handler
  const CreateBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setErrorMessage({ 'text': 'A new blog' + returnedBlog.title + ' Added', 'type': 'success' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }catch{
      setErrorMessage({ 'text': 'Missing fields in Blog', 'type': 'error' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  //like blog handler
  const handleLikes =async (blog) => {
    const updatedBlog = {
      ...blog, likes: blog.likes + 1, user: blog.user.id
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))

  }

  //delete blog handler
  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmDelete) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  if(user === null) {
    return (
      <div>
        <Notification message={errorMessage?.text} type={errorMessage?.type} />
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
      <Notification message={errorMessage?.text} type={errorMessage?.type} />
      <h2>blogs</h2>
      {user && (<div>
        <h3>{user.name} logged in <button onClick={handleLogout}>logout</button></h3>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm CreateBlog={CreateBlog} />
        </Togglable>
      </div>)}
      {[...blogs].sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} handleLikes={handleLikes} handleDelete={handleDelete} user={user}/>
        )}
    </div>
  )
}

export default App