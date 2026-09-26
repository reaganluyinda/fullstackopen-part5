const {test, expect, beforeEach, describe} = require('@playwright/test');
const {loginWith, createBlog} = require('./helper');

describe('Blog app', () =>{
    beforeEach(async ({page, request}) => {
        await request.post('/api/testing/reset');
        await request.post('/api/users', {
            data: {
                
                name: 'Reagan Luyinda',
                username: 'Reagan',
                password: '123456789'
            }
        });
        await page.goto('/');
    })

    test('Login form is shown', async ({page}) => {
        const locator = page.getByText('Log in to application');
        await expect(locator).toBeVisible();
        await expect(page.getByLabel('username')).toBeVisible();
        await expect(page.getByLabel('password')).toBeVisible();
        await expect(page.getByRole('button', {name: 'login'})).toBeVisible();
    
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({page}) =>{
         await loginWith(page, 'Reagan', '123456789');
            await expect(page.getByText('Welcome, Reagan Luyinda')).toBeVisible();
            await expect(page.getByText('Reagan Luyinda logged in')).toBeVisible();   
        })

        test('fails with wrong credentials', async ({page}) =>{
            await loginWith(page, 'Reagan', 'wrong');
            await expect(page.getByText('Wrong username or password')).toBeVisible();
            await expect(page.getByRole('button', {name: 'login'})).toBeVisible();
            
        })
    })

    describe('When logged in ', () => {
        beforeEach(async ({page}) => {
            await loginWith(page, 'Reagan', '123456789');
        })

        test('a new blog can be created', async ({page}) => {
            await createBlog(page, 'Spiderman', 'John Doe', 'http://testblog.com');
            await expect(page.getByText(' A new blog Spiderman Added')).toBeVisible();
            await expect(page.getByText('Spiderman John Doe')).toBeVisible();
        })
    })
})