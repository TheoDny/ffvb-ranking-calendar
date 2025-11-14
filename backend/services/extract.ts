import * as cheerio from 'cheerio';
import { queryTableCalendarToArray, queryTableTeamsToArray } from "../utils/crawler";
import logger from "../utils/logger";

export const extractTeams = async(url: string) => {
    try {
        logger.info('Fetching ' + url);
        const $ = await cheerio.fromURL(url);
        const table = $("body table").eq(2);
        const arrayTeams = queryTableTeamsToArray(table);

        return arrayTeams;
    } catch (error) {
        logger.error(error, "", "extractTeams");
        return false;
    }
}

export const extractAll = async (url: string) => {
    try {
        logger.info('Fetching ' + url);
        const $ = await cheerio.fromURL(url);
        const table = $("body table").eq(3);
        const arrayCalendar = queryTableCalendarToArray(table);
        return arrayCalendar;
    } catch (error) {
        logger.error(error, "", "extractAll");
        return false;
    }
}

