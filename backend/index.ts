import dotenv from "dotenv"

// Load environment variables BEFORE other imports
dotenv.config()

import express, { Express } from "express"
import helmet from "helmet"
import serverlessHttp from "serverless-http"
import { errorHandler } from "./middleware/errorHandler"
import { apiLimiter } from "./middleware/rateLimiter"
import { routes } from "./routes"

const app: Express = express()

// Security middleware
app.use(helmet())

// Rate limiting for all API routes
app.use("/api", apiLimiter)

// API routes
app.use("/api", routes)

// Global error handler (must be last)
app.use(errorHandler)

module.exports.handler = serverlessHttp(app)
