import * as cheerio from "cheerio"
import { CALENDAR_TABLE_INDEX, TEAMS_TABLE_INDEX } from "../constants"
import { RawCalendarArray } from "../types"
import { parseCalendarTable, parseTeamsTable } from "../utils/crawler"
import logger from "../utils/logger"

export const extractTeams = async (url: string): Promise<string[] | false> => {
    try {
        logger.info("Fetching " + url, "extractTeams")
        const $ = await cheerio.fromURL(url)
        const table = $("body table").eq(TEAMS_TABLE_INDEX)
        const arrayTeams = parseTeamsTable(table)

        return arrayTeams
    } catch (error) {
        logger.error(error, "Failed to extract teams", "extractTeams")
        return false
    }
}

export const extractAll = async (url: string): Promise<RawCalendarArray | false> => {
    try {
        logger.info("Fetching " + url, "extractAll")
        const $ = await cheerio.fromURL(url)
        const table = $("body table").eq(CALENDAR_TABLE_INDEX)
        const arrayCalendar = parseCalendarTable(table)

        return arrayCalendar
    } catch (error) {
        logger.error(error, "Failed to extract calendar", "extractAll")
        return false
    }
}
