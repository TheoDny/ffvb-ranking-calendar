import winston from "winston"

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    defaultMeta: { service: "ffvb-calendar" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, location, ...meta }) => {
                    let log = `${timestamp} [${level}]`
                    if (location) {
                        log += ` [${location}]`
                    }
                    log += `: ${message}`
                    if (Object.keys(meta).length > 0 && meta.service !== "ffvb-calendar") {
                        log += ` ${JSON.stringify(meta)}`
                    }
                    return log
                }),
            ),
        }),
    ],
})

const error = (err: unknown, msg: string = "", location = "") => {
    logger.error(msg || "Error occurred", {
        location,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
    })
}

const info = (infoMsg: unknown, location = "") => {
    logger.info(String(infoMsg), { location })
}

const log = (logMsg: unknown, location = "") => {
    logger.info(String(logMsg), { location })
}

export default {
    error,
    info,
    log,
    winston: logger, // Export the winston instance for advanced usage
}
