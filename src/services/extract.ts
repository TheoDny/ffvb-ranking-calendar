import {sleep} from "../utils/utils";
import {crawler, queryTableCalendarToArray} from "../utils/crawler";
import logger from "../utils/logger";

export const extractRanking = () => {

}

export const extractCalendar = () => {

}

export const extractAll = async (url: string) => {
    let arrayCalendar: string[][][] | false | null = null
    crawler.queue([{
        uri: url,

        callback: (error: any, res: any, done: () => any) => {
            if (error) {
                logger.error(error, "", "extractAll - crawler callback");
            } else {
                logger.info('Grabbed ' + url);
                const table = res.$("body table")['3'];
                arrayCalendar = queryTableCalendarToArray(table)
            }
            done()
        }
    }])
    let i_timeout = 0
    while (arrayCalendar === null && i_timeout < 100) {
        await sleep(100)
        i_timeout = i_timeout + 1
    }
    return arrayCalendar
}



