import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {

  const blog = {
    title: 'vappu celebration',
    author: 'yle news',
    url: 'http://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }

  }

  test('shows title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} />)

    const titleElement = screen.getByText('vappu celebration yle news')

    expect(titleElement).toBeDefined()})


  test('shows url and likes when view button is clicked', async () => {

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.findByText('http://testblog.com')
    const likesElement = screen.findByText('5')

    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
  })

  test('calls event handler twice when like button is clicked twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} handleLikes={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})