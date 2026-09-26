const {test, expect, beforeEach, describe} = require('@playwright/test');

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
         await page.getByLabel('username').fill('Reagan');
         await page.getByLabel('password').fill('123456789');
            await page.getByRole('button', {name: 'login'}).click();
            await expect(page.getByText('Welcome, Reagan Luyinda')).toBeVisible();
            await expect(page.getByText('Reagan Luyinda logged in')).toBeVisible();   
        })

        test('fails with wrong credentials', async ({page}) =>{
            await page.getByLabel('username').fill('Reagan');
            await page.getByLabel('password').fill('wrongpassword');
            await page.getByRole('button', {name: 'login'}).click();
            await expect(page.getByText('Wrong username or password')).toBeVisible();
            await expect(page.getByRole('button', {name: 'login'})).toBeVisible();
            
        })
    })

    // describe('When logged in ', () => {
    //     beforeEach(async ({page}) => {
    //         await page.getByLabel('username').fill('Reagan');
    //         await page.getByLabel('password').fill('123456789');
    //         await page.getByRole('button', {name: 'login'}).click();
    //     })

    //     test('a new blog can be created', async ({page}) => {

    //     })
    // })
})