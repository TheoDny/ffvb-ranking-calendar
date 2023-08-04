import express from 'express';
import {calendarRoute} from './calendar';
import {infoRoute} from './info';

export const routes = express.Router();

routes.use(calendarRoute);

routes.use(infoRoute);
