import { Request, Response } from "express"
import { ERROR_MESSAGES } from "../constants"
import { extractTeams } from "../services/extract"
import { FFVBParams } from "../types"
import { sendError, sendResponse } from "../utils/response"
import { getUrl } from "../utils/utils"

const getTeams = async (req: Request, res: Response): Promise<void> => {
    const { saison, codent, poule } = req.query as unknown as FFVBParams

    const url = getUrl(saison, codent, poule)
    const data = await extractTeams(url)
    if (data) {
        sendResponse(res, data, `GET - ${saison} ${codent} ${poule}`)
    } else {
        sendError(res, ERROR_MESSAGES.FFVB_TIMEOUT)
    }
}

export default {
    getTeams,
}
