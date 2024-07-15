import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls event handler with correct details when a new blog is created', async () => {
  const mockHandler = vi.fn()

  render(<BlogForm addBlog={mockHandler} />)

  const user = userEvent.setup()

  // Simulate user input
  const titleInput = screen.getByLabelText(/title:/i)
  const authorInput = screen.getByLabelText(/author:/i)
  const urlInput = screen.getByLabelText(/url:/i)
  const submitButton = screen.getByText('save')

  await user.type(titleInput, 'Rendering the component for tests')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://example.com')

  // Simulate form submission
  await user.click(submitButton)

  // Check that the handler was called with the correct details
  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'Rendering the component for tests',
    author: 'Test Author',
    url: 'http://example.com'
  })
})
