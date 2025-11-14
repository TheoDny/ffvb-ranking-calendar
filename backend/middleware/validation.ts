import { NextFunction, Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { sendError } from "../utils/response"

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((err) => `${err.type === "field" ? err.path : "unknown"}: ${err.msg}`)
            .join(", ")
        sendError(res, `Validation failed: ${errorMessages}`, 400)
        return
    }
    next()
}

// Validation rules for FFVB parameters
export const validateFFVBParams = [
    query("saison")
        .trim()
        .notEmpty()
        .withMessage("saison is required")
        .matches(/^\d{4}\/\d{4}$/)
        .withMessage("saison must be in format YYYY/YYYY"),
    query("codent").trim().notEmpty().withMessage("codent is required"),
    query("poule").trim().notEmpty().withMessage("poule is required"),
    handleValidationErrors,
]

// Validation rules for calendar ICS endpoint (includes team)
export const validateCalendarICSParams = [
    query("saison")
        .trim()
        .notEmpty()
        .withMessage("saison is required")
        .matches(/^\d{4}\/\d{4}$/)
        .withMessage("saison must be in format YYYY/YYYY"),
    query("codent").trim().notEmpty().withMessage("codent is required"),
    query("poule").trim().notEmpty().withMessage("poule is required"),
    query("team").trim().notEmpty().withMessage("team is required"),
    handleValidationErrors,
]
