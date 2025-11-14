import { createEvents, EventAttributes } from "ics"
import {
    DEFAULT_MATCH_DURATION_HOURS,
    DEFAULT_TIMEZONE,
    EMPTY_TIME,
    INVALID_TIME_MARKER,
    MATCH_AWAY_TEAM_INDEX,
    MATCH_DATE_INDEX,
    MATCH_HOME_TEAM_INDEX,
    MATCH_LOCATION_INDEX,
    MATCH_TIME_INDEX,
} from "../constants"
import { RawCalendarArray } from "../types"
import logger from "./logger"

export const calendarArrayToICSArray = (
    cal: RawCalendarArray,
    team: string,
    url: string = "",
): EventAttributes[] => {
    const ics_array: EventAttributes[] = []

    cal.forEach((day, index) => {
        day.forEach((match) => {
            const homeTeam = match[MATCH_HOME_TEAM_INDEX]
            const awayTeam = match[MATCH_AWAY_TEAM_INDEX]
            const matchTime = match[MATCH_TIME_INDEX]
            const matchDate = match[MATCH_DATE_INDEX]

            // Check if this match involves the team and has valid time
            if (
                (homeTeam === team || awayTeam === team) &&
                matchTime !== INVALID_TIME_MARKER &&
                matchTime !== EMPTY_TIME
            ) {
                const title = `J${index + 1} - ${homeTeam} / ${awayTeam} `
                const date = matchDate.split("/") // [DD,MM,YY]
                const hour = matchTime.split(":") // [HH,MM]
                const dateArray: [number, number, number, number, number] = [
                    2000 + parseInt(date[2]),
                    parseInt(date[1]),
                    parseInt(date[0]),
                    parseInt(hour[0]),
                    parseInt(hour[1]),
                ]
                const event_ics: EventAttributes = {
                    title: title,
                    startInputType: "local",
                    startOutputType: "local",
                    start: dateArray,
                    duration: { hours: DEFAULT_MATCH_DURATION_HOURS },
                    url: url,
                    calName: DEFAULT_TIMEZONE,
                }

                const location = match[MATCH_LOCATION_INDEX]
                if (location && location.length !== 1) {
                    const homeTeamParts = homeTeam.split(" ")
                    const homeTeamWithoutNumber = homeTeamParts.slice(0, -1).join(" ")
                    event_ics.location = homeTeamWithoutNumber + ", " + location
                }

                ics_array.push(event_ics)
            }
        })
    })
    return ics_array
}

export const ICSArrayToICSString = (ics_array: EventAttributes[]): string | undefined => {
    const { error, value } = createEvents(ics_array)

    if (error) {
        logger.error(error, "Error while creating the events", "ICSArrayToICSString")
        return
    }
    return value
}
