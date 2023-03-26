//import {EventAttributes,createEvents} from 'ics'
import {createEvents, EventAttributes} from 'ics'
import logger from "./logger";

export const calendarArrayToICSArray = (cal: string[][][], team: string, url: string = "") => {
    let ics_array: EventAttributes[] = []

    cal.forEach((day, index) => {
        day.forEach((match) => {
            if ((match["3"] === team || match["5"] === team) && match["2"] !== "00:01") {
                const title = `J${index + 1} - ${match["3"]} / ${match["5"]} `
                const date = match["1"].split("/")
                const hour = match["2"].split(":")
                let event_ics: EventAttributes = {
                    title: title,
                    start: [2000 + parseInt(date[2]),
                        parseInt(date[1]),
                        parseInt(date[0]),
                        parseInt(hour[0]),
                        parseInt(hour[1])],
                    duration: {hours: 2},
                    url: url
                }
                if (match["6"] && match["6"].length !== 1) {
                    event_ics.location = match["3"].split(" ")[0] + ", " + match["6"]
                }

                ics_array.push(event_ics)
            }
        })
    })
    return ics_array
}

export const ICSArrayToICSString = (ics_array: EventAttributes[]) => {
    const {error, value} = createEvents(ics_array)

    if (error) {
        logger.error(error, "Error while creating the events", "ICSArrayToICSString")
        return
    }
    return value
}
