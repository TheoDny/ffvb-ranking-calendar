import express, {Express} from 'express'
import dotenv from 'dotenv'
import {routes} from './routes'
import path from 'path'

dotenv.config()
const app: Express = express()
const PORT = process.env.PORT || 8080

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')))

// API routes
app.use("/api", routes)

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

