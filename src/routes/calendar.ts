import express from 'express';
import calendarController from "../controllers/calendarController";

export const calendarRoute = express.Router();

calendarRoute.get('/calendar/raw', calendarController.getRaw);

calendarRoute.get('/calendar/ics', calendarController.getIcs);
