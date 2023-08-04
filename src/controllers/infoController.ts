import {Request, Response} from "express";
import {getUrl} from "../utils/utils";
import {extractTeams} from "../services/extract";
import {missingParam, sendError, sendResponse} from "../../request/response";
import logger from "../utils/logger";

const getTeams = async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore
    const {saison, codent, poule}: { saison: string, codent: string, poule: string } = req.query;
    if (saison && codent && poule) {
        const url = getUrl(saison, codent, poule)
        const data = await extractTeams(url)
        if (data) {
            sendResponse(res, data, `GET - ${saison} ${codent} ${poule}`)
        } else {
            sendError(res, "server FFVB timed out or internal server error (scheck your parameters)")
        }

    } else {
        let msgError = (saison ? "" : " saison ") + (codent ? "" : " codent ") + (poule ? "" : " poule ")
        logger.error(msgError, "", "getRaw")
        missingParam(res, msgError)
    }
}

export default {
    getTeams,
}
