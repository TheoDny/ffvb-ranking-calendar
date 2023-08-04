import express from 'express';
import infoController from "../controllers/infoController";

export const infoRoute = express.Router();

infoRoute.get('/getteams', infoController.getTeams);

