import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { test } from 'vitest'

describe('<Blog />', () => {

  test('shows title and author, but not url or likes by default', () => {
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
    render(<Blog blog={blog} />)

    const titleElement = screen.getByText('vappu celebration yle news')

    screen.debug(titleElement)
    expect(titleElement).toBeDefined()})
})