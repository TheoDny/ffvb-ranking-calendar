import rateLimit from "express-rate-limit"

// General API rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
})

// Stricter rate limiter for scraping endpoints - 20 requests per 15 minutes
// This protects both our server and FFVB's server from abuse
export const scrapingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: "Too many scraping requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
})
