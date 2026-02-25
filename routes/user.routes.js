import express from 'express';
import db from '../db/index.js'
import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm'
import { randomBytes, createHmac } from 'node:crypto'
import { error } from 'node:console';



const routes = express.Router()

routes.get('/', (req, res) => {
    // return currect logged in user
    res.json({ message: 'Get current user' })
})

routes.post('/signup', async (req, res) => {
    const { name, email, password } = req.body || {}

    const [existingUser] = await db
        .select({
            email: usersTable.email
        })
        .from(usersTable)
        .where((table) => eq(table.email, email))

    if (existingUser) {
        return res.status(400).json({ error: `user is ${email} already exist!` })
    }

    const salt = randomBytes(256).toString('hex')
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')

    const [user] = await db.insert(usersTable).values({
        name,
        email,
        password: hashedPassword,
        salt
    }).returning({ id: usersTable.id })

    return res.status(201).json({ status: 'success', data: { userId: user.id } })

})


routes.post('/login', async (req, res) => {
    const { email, password } = req.body || {}

    const [existingUser] = await db
        .select({
            email: usersTable.email,
            salt: usersTable.salt,
            password: usersTable.password
        })
        .from(usersTable)
        .where((table) => eq(table.email, email))

    if (!existingUser) {
        return res.status(401).json({ error: `user with ${email} does not exist!` })
    }

    const salt = existingUser.salt
    const existingHash = usersTable.password

    const newHash = createHmac('sha256', salt).update(password).digest('hex')
    if (newHash !== existingHash) {
        return res.status(400).json({ error: "incorrect password" })
    }
    //generate session for user 
    return res.json({ status: 'success' })

})

export default routes;