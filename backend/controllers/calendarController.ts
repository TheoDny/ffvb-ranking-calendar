import { Request, Response } from "express"
import { EventAttributes } from "ics"
import { ERROR_MESSAGES } from "../constants"
import { extractAll } from "../services/extract"
import { CalendarICSParams, FFVBParams } from "../types"
import { calendarArrayToICSArray, ICSArrayToICSString } from "../utils/convert"
import logger from "../utils/logger"
import { sendError, sendFileICS, sendResponse } from "../utils/response"
import { getUrl } from "../utils/utils"

const getRaw = async (req: Request, res: Response): Promise<void> => {
    const { saison, codent, poule } = req.query as unknown as FFVBParams

    const url = getUrl(saison, codent, poule)
    const data = await extractAll(url)
    if (data) {
        sendResponse(res, data, `GET - ${saison} ${codent} ${poule}`)
    } else {
        sendError(res, ERROR_MESSAGES.FFVB_TIMEOUT)
    }
}

const getIcs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { saison, codent, poule, team } = req.query as unknown as CalendarICSParams

        const url = getUrl(saison, codent, poule)
        const data = await extractAll(url)

        if (data) {
            const array_ics: EventAttributes[] = calendarArrayToICSArray(data, team, url)
            if (array_ics.length === 0) {
                const msgError = `${ERROR_MESSAGES.NO_TEAM_FOUND} ${team}`
                logger.error(msgError, msgError, "getIcs")
                sendError(res, msgError, 400)
                return
            }

            const icsText = ICSArrayToICSString(array_ics)

            if (icsText) {
                sendFileICS(res, icsText, `${team}-${saison}-${poule}.ics`)
                return
            } else {
                sendError(res, ERROR_MESSAGES.ICS_CONVERSION_ERROR)
                return
            }
        } else {
            sendError(res, ERROR_MESSAGES.FFVB_TIMEOUT)
            return
        }
    } catch (e) {
        logger.error(e, "Error in getIcs", "getIcs")
        sendError(res)
        return
    }
}

export default {
    getIcs,
    getRaw,
}
