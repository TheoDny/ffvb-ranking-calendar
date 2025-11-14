import rateLimit from "express-rate-limit"
import { ERROR_MESSAGES } from "../constants"

// General API rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
        status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// Stricter rate limiter for scraping endpoints - 20 requests per 15 minutes
// This protects both our server and FFVB's server from abuse
export const scrapingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: {
        message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
        status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
})
