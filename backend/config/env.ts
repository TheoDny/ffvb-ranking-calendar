import logger from "../utils/logger"

interface EnvConfig {
    PORT: number
    URL_FFVB: string
    NODE_ENV: string
    LOG_LEVEL: string
}

function validateEnv(): EnvConfig {
    const requiredVars = ["URL_FFVB"]

    const missing = requiredVars.filter((varName) => !process.env[varName])

    if (missing.length > 0) {
        const errorMsg = `Missing required environment variables: ${missing.join(", ")}`
        logger.error(errorMsg, errorMsg, "validateEnv")
        throw new Error(errorMsg)
    }

    // Validate URL_FFVB is a valid URL
    try {
        new URL(process.env.URL_FFVB!)
    } catch (e) {
        const errorMsg = "URL_FFVB is not a valid URL"
        logger.error(e, errorMsg, "validateEnv")
        throw new Error(errorMsg)
    }

    return {
        PORT: parseInt(process.env.PORT || "8080", 10),
        URL_FFVB: process.env.URL_FFVB!,
        NODE_ENV: process.env.NODE_ENV || "development",
        LOG_LEVEL: process.env.LOG_LEVEL || "info",
    }
}

export const config = validateEnv()
