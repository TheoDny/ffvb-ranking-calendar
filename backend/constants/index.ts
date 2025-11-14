// Table parsing constants
export const TEAMS_TABLE_INDEX = 2
export const CALENDAR_TABLE_INDEX = 3

// Match array indices (from FFVB HTML structure)
export const MATCH_DATE_INDEX = 1
export const MATCH_TIME_INDEX = 2
export const MATCH_HOME_TEAM_INDEX = 3
export const MATCH_AWAY_TEAM_INDEX = 5
export const MATCH_LOCATION_INDEX = 6

// Calendar event defaults
export const DEFAULT_MATCH_DURATION_HOURS = 2
export const DEFAULT_TIMEZONE = "Europe/Paris"

// Time constants
export const INVALID_TIME_MARKER = "00:01"
export const EMPTY_TIME = ""

// HTTP timeouts (in milliseconds)
export const CHEERIO_TIMEOUT = 10000

// Error messages
export const ERROR_MESSAGES = {
    FFVB_TIMEOUT: "server FFVB timed out or internal server error (check your parameters)",
    MISSING_PARAMS: "Missing parameters",
    NO_TEAM_FOUND: "No team named",
    ICS_CONVERSION_ERROR: "Error convert build ICS",
    PARSING_ERROR: "Error while parsing",
} as const
