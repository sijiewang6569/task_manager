import express from 'express'
require('./db/mongoose')
import userRouter from './routers/user'
import taskRouter from './routers/task'

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

export default app