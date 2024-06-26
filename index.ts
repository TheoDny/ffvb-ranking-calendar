import express, {Express} from 'express'
import dotenv from 'dotenv'
import {routes} from './src/routes'

dotenv.config()
const serverless = require("serverless-http")
const app: Express = express()

app.use("/api", routes)

module.exports.handler = serverless(app)