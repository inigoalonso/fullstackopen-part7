import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', async () => {
  const blog = {
    title: 'Rendering the component for tests',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser'
    },
    id: '123'
  }

  const mockHandler = vi.fn()

  render(
    <Blog key={blog.id} blog={blog} handleLike={mockHandler} handleDelete={mockHandler} currentUser={blog.user} />
  )
// Check that title and author are rendered
const titleAuthorElement = screen.getByText('Rendering the component for tests Test Author')
expect(titleAuthorElement).toBeDefined()

// Check that URL and likes are not rendered by default
const urlElement = screen.queryByText('http://example.com')
const likesElement = screen.queryByText(/likes 0/)
expect(urlElement).toBeNull()
expect(likesElement).toBeNull()
})

test('renders blog details when the button is clicked', async () => {
const blog = {
  title: 'Rendering the component for tests',
  author: 'Test Author',
  url: 'http://example.com',
  likes: 0,
  user: {
    username: 'testuser'
  },
  id: '123'
}

const mockHandler = vi.fn()

render(
  <Blog key={blog.id} blog={blog} handleLike={mockHandler} handleDelete={mockHandler} currentUser={blog.user} />
)

const user = userEvent.setup()
const button = screen.getByText('view')
await user.click(button)

// Check that URL and likes are rendered after clicking the button
const urlElement = screen.getByText('http://example.com')
const likesElement = screen.getByText(/likes 0/)
expect(urlElement).toBeDefined()
expect(likesElement).toBeDefined()
})

test('calls event handler twice if the like button is clicked twice', async () => {
  const blog = {
    title: 'Rendering the component for tests',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser'
    },
    id: '123'
  }

  const mockHandler = vi.fn()

  render(
    <Blog key={blog.id} blog={blog} handleLike={mockHandler} handleDelete={mockHandler} currentUser={blog.user} />
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})