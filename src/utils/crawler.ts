import logger from "./logger";

const Crawler = require('crawler');

export const crawler = new Crawler({
    retries: 1,
    jQuery: 'cheerio'
});

export function queryTableCalendarToArray(table: any): string[][][] | false {
    let arrayTable: any[][][] = []
    let dayArray: any[][] = []
    let tdArray: any[] = []
    let numDay = 0
    try {
        const rows = table.children;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.children;

            let j: number
            for (j = 0; j < cells.length - 1; j++) {
                const cell = cells[j];

                try {
                    let data: string
                    if (cell.name === "form") {
                        // peculiar thing the table seen by the user is not the same
                        // as the one sent by the request (on the ffvb website)
                        data = cell.children[1].children[0].data
                    } else {
                        data = cell.children[0].data
                    }
                    tdArray.push(data ? data : "")
                } catch (e) {
                    tdArray.push("")
                }
            }
            if (j === 0) {
                if (i !== 0) {
                    arrayTable.push(dayArray)
                    numDay += 1
                    dayArray = []
                }
            } else {
                dayArray.push(tdArray)
                tdArray = []
            }
        }
        return arrayTable
    } catch (e) {
        logger.error(e, "Error while parsing", "queryTableCalendarToArray");
        return false
    }

}
