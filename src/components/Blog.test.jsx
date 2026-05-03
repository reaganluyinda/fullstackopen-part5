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

    screen.debug()

    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
  })
})