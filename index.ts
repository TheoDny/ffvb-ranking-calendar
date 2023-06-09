import express, {Express} from 'express'
import dotenv from 'dotenv'
import {routes} from './src/routes'
import {resolve} from 'path'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 80
const app_url = process.env.APP_URL || "http://localhost"

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${app_url}:${port}`)
})

app.use("/", routes)

app.use("/styles", express.static(__dirname + '/../public/styles'));
app.use("/views", express.static(__dirname + '/../public/views'));
app.use("/scripts", express.static(__dirname + '/../public/scripts'));

app.get('/', function (req, res) {
    res.sendFile(resolve("public/views/form.html"),)
})

app.get('*', function (req, res) {
    res.redirect("/")
})
