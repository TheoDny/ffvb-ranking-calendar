import express from "express"
import infoController from "../controllers/infoController"
import { scrapingLimiter } from "../middleware/rateLimiter"
import { validateFFVBParams } from "../middleware/validation"

export const infoRoute = express.Router()

infoRoute.get("/getteams", scrapingLimiter, validateFFVBParams, infoController.getTeams)
