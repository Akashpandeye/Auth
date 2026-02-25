import express from 'express'

import userRouter from './routes/user.routes.js'

const app = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json())

app.get('/',(req,res)=>{
    return res.json({status: "server is running"})
})

app.use('/user',userRouter)

app.listen(PORT,()=>{
    `Server is running on ${PORT}`
})