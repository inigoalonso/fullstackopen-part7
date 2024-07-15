import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: '' })
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    try {
      if (!blogObject.title || !blogObject.author || !blogObject.url) {
        setNotification({
          message: 'Title, Author and URL are required',
          type: 'error'
        })
        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
        return
      }
    } catch (exception) {
      setNotification({
        message: 'Title, Author and URL are required',
        type: 'error'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
    try {
      blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNotification({
            message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
            type: 'success'
          })
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
    } catch (exception) {
      setNotification({
        message: 'Error creating blog',
        type: 'error'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: user.id
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
      setNotification({
        message: `Liked ${returnedBlog.title} by ${returnedBlog.author}`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    } catch (exception) {
      setNotification({
        message: 'Error liking blog',
        type: 'error'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      setNotification({
        message: `${user.name} logged-in`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({
        message: 'wrong username or passwords',
        type: 'error'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotification({
          message: `Deleted ${blog.title} by ${blog.author}`,
          type: 'success'
        })
        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
      } catch (exception) {
        setNotification({
          message: 'Error deleting blog',
          type: 'error'
        })
        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
      }
    }
  }

  const loginForm = () => {
    return (
      <div>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
      </div>
    )
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            addBlog={addBlog}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Blog App</h1>

      <Notification message={notification.message} type={notification.type} />

      {user === null ?
        loginForm() :
        <div>
          <p><span>{user.name} logged in</span> <button onClick={() => logout()}>logout</button></p>
          {blogForm()}
          <h2>blogs</h2>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} currentUser={user} />
            )}
        </div>
      }

    </div>
  )
}

export default App