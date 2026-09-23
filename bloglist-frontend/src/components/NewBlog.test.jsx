import { render,screen } from '@testing-library/react'
import BlogForm from './newBlog'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {

  test('calls event handler with the right details when a new blog is created', async () => {
    const mockHandler = vi.fn()
    render(<BlogForm CreateBlog={mockHandler} />)

    const user = userEvent.setup()
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const createButton = screen.getByText('create')
    await user.type(titleInput, 'Testing a form...')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testurl.com')
    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0]).toEqual([
      {
        title: 'Testing a form...',
        author: 'Test Author',
        url: 'http://testurl.com'
      }
    ])
  })
})