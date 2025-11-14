import dotenv from "dotenv"

// Load environment variables BEFORE importing config
dotenv.config()

import express, { Express } from "express"
import helmet from "helmet"
import path from "path"
import { config } from "./config/env"
import { errorHandler } from "./middleware/errorHandler"
import { apiLimiter } from "./middleware/rateLimiter"
import { routes } from "./routes"
import logger from "./utils/logger"

const app: Express = express()
const PORT = config.PORT

// Security middleware
app.use(helmet())

// Rate limiting for all API routes
app.use("/api", apiLimiter)

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "../frontend")))

// API routes
app.use("/api", routes)

// Serve index.html for root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

// Global error handler (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`, "server")
})
