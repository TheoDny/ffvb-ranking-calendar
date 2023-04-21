import {Request, Response} from "express";
import {extractAll} from "../services/extract";
import {calendarArrayToICSArray, ICSArrayToICSString} from "../utils/convert";
import {missingParam, sendError, sendFileICS, sendResponse} from "../../request/response";
import logger from "../utils/logger";
import {EventAttributes} from "ics"
import {getUrl} from "../utils/utils";

const getRaw = async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore
    const {saison, codent, poule}: { saison: string, codent: string, poule: string } = req.query;
    if (saison && codent && poule) {
        const url = getUrl(saison, codent, poule)
        const data = await extractAll(url)
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

const getIcs = async (req: Request, res: Response): Promise<void> => {
    try {

        // @ts-ignore
        const {
            saison,
            codent,
            poule,
            team
        }: { saison: string, codent: string, poule: string, team: string } = req.query;

        if (saison && codent && poule && team) {
            const url = getUrl(saison, codent, poule)
            const data: string[][][] | null = await extractAll(url)

            if (data) {
                const array_ics: EventAttributes[] = calendarArrayToICSArray(data, team, url)
                if (array_ics.length === 0) {
                    let msgError = "No team named " + team
                    logger.error(msgError, "", "getIcs")
                    sendError(res, msgError, 400)
                    return
                }

                const icsText = ICSArrayToICSString(array_ics)

                if (icsText) {
                    sendFileICS(res, icsText, `${team}-${saison}-${poule}.ics`)
                    return
                } else {
                    sendError(res, "Error convert build ICS")
                    return
                }
            } else {
                sendError(res, "FFVB Server timed out or Internal server error (check your parameters)")
                return
            }

        } else {
            let msgError = (saison ? "" : " saison ") + (codent ? "" : " codent ") + (poule ? "" : " poule ") + (team ? "" : " team ")
            logger.error(msgError, "", "getIcs")
            missingParam(res, msgError)
            return
        }
    } catch (e: any) {
        logger.error(e, "", "getIcs")
        sendError(res)
        return
    }
}

export default {
    getIcs,
    getRaw
}
