// import axios from 'axios'
const { describe, test, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the DB here
    try {
      await request.post('/api/testing/reset')
      console.log('Database reset')
    }
    catch (error) {
      console.error(error)
      console.log('Error resetting the database')
    }

    // create a "tester" user for the backend here
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'tester',
        password: '420',
      }
    })
    // create a "other" user for the backend here
    await request.post('/api/users', {
      data: {
        name: 'Other User',
        username: 'other',
        password: '420',
      }
    })
    // Check that the user was created
    // const response = await request.get('/api/users')
    // const users = await response.json()
    // console.log('users', users)

    await page.goto('/')
  })

  test('the blogs database is empty at start', async ({ page, request }) => {
    const response = await request.get('/api/blogs')
    // console.log('response status', response.status())
    expect(response.status()).toBe(200)

    const responseBody = await response.json();
    // console.log('response', responseBody);
    expect(responseBody).toEqual([]);
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('Blog App')).toBeVisible()
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('valid user can login', async ({ page }) => {
    try {
      await loginWith(page, 'tester', '420')
    }
    catch (error) {
      console.error(error)
    }
  
    await expect(page.getByTestId('notification')).toHaveText('Test User logged-in')
  })

  test('invalid user cannot login', async ({ page }) => {
    await loginWith(page, 'tester', 'wrong')
  
    await expect(page.getByText('wrong username or password')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', '420')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'With a Great Title', 'Test User', 'https://example.com')
      await expect(page.getByText('a new blog With a Great Title by Test User added')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'With a Great Title', 'Test User', 'https://example.com')
      })

      test('user can like a blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Liked With a Great Title by Test User')).toBeVisible()
      })

      test('user can delete a blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        // deal with the window.confirm
        page.on('dialog', async dialog => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'delete' }).click()
        await expect(page.getByText('With a Great Title Test User')).not.toBeVisible()
      })

      test('only the user who created the blog can see the delete button', async ({ page }) => {
        // await page.goto('/')
        // await createBlog(page, 'With a Great Title', 'Test User', 'https://example.com')
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'other', '420')
        await page.getByRole('button', { name: 'cancel' }).click()
        await page.getByRole('button', { name: 'view' }).click()
        // await createBlog(page, 'Another Great Title', 'Other User', 'https://example.com')
        // await page.getByRole('button', { name: 'cancel' }).click()
        // await page.getByRole('button', { name: 'view' }).click()
        // count the number of delete buttons and check none is visible
        const deleteButtons = await page.$$('button[name=delete]')
        expect(deleteButtons.length).toBe(0)
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await createBlog(page, 'With a Great Title 2', 'Test User', 'https://example.com')
        for (let i = 0; i < 5; i++) {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'like' }).click()
        }
        const blogs = await page.$$('.blog')
        expect(blogs.length).toBe(2)
        const likes = await blogs[0].$('p')
        expect(likes).toHaveText('likes 5')
      })

    })
  })
})