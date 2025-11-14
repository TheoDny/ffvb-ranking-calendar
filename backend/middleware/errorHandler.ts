import { NextFunction, Request, Response } from "express"
import logger from "../utils/logger"

// Custom error class
export class AppError extends Error {
    statusCode: number
    isOperational: boolean

    constructor(message: string, statusCode: number = 500) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

// Global error handler middleware
export const errorHandler = (err: Error | AppError, req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = err instanceof AppError ? err.statusCode : 500
    const message = err.message || "Internal server error"

    logger.error(err, `${req.method} ${req.path} - ${message}`, "errorHandler")

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    })
}

// Async error wrapper to catch errors in async route handlers
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}
