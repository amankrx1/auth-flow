import express from 'express'
import { connectDB } from './config/database.js';
import { PORT } from './config/config.js';
import { ErrorMiddleware } from './utils/ErrorHandler.js';
import userRouter from './routes/user.js'

const app = express();
connectDB();

app.use(express.json());


app.use("/api/v1", userRouter)

app.use(ErrorMiddleware)
app.listen(3000, () => {
    console.log(`Server is running on port ${3000}...`)
})
