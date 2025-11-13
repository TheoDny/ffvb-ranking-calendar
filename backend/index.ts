import dotenv from 'dotenv'
import express, { Express } from 'express'
import { routes } from './routes'

dotenv.config()
const serverless = require("serverless-http")
const app: Express = express()

app.use("/api", routes)

module.exports.handler = serverless(app)

