import express from 'express';
import {calendarRoute} from './calendar';

export const routes = express.Router();

routes.use(calendarRoute);
