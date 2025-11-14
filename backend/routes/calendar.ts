import express from "express"
import calendarController from "../controllers/calendarController"
import { scrapingLimiter } from "../middleware/rateLimiter"
import { validateCalendarICSParams, validateFFVBParams } from "../middleware/validation"

export const calendarRoute = express.Router()

calendarRoute.get("/calendar/raw", scrapingLimiter, validateFFVBParams, calendarController.getRaw)

calendarRoute.get("/calendar/ics", scrapingLimiter, validateCalendarICSParams, calendarController.getIcs)
