import { useState } from 'react'
const Blog = ({ blog, handleLikes, handleDelete, user }) => {

  const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(prev => !prev)
    }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isCreator = user && blog.user && blog.user.username === user.username

  return (
  <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          {blog.url}
          <br />
          {blog.likes} likes <button onClick={()=> handleLikes(blog)}>like</button>
          <br />
          {blog.user?.name}
          {isCreator && <button onClick={() => handleDelete(blog)}>remove</button>}
        </div>
      )}
  </div>  
)}

export default Blog