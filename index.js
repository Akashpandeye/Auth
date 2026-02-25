import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 8000


app.get('/',(req,res)=>{
    return res.json({status: "server is running"})
})

app.listen(PORT,()=>{
    `Server is running on ${PORT}`
})