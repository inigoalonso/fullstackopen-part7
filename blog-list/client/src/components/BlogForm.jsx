import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    if (name === 'title') {
      setNewTitle(value)
    } else if (name === 'author') {
      setNewAuthor(value)
    } else if (name === 'url') {
      setNewUrl(value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <h2>create new</h2>
      <label htmlFor="title">title:</label>
      <input
        data-testid='title'
        id="title"
        name="title"
        value={newTitle}
        onChange={handleBlogChange}
      />
      <br />
      <label htmlFor="author">author:</label>
      <input
        data-testid='author'
        id="author"
        name="author"
        value={newAuthor}
        onChange={handleBlogChange}
      />
      <br />
      <label htmlFor="url">url:</label>
      <input
        data-testid='url'
        id="url"
        name="url"
        value={newUrl}
        onChange={handleBlogChange}
      />
      <br />
      <button type="submit">save</button>
    </form>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm
