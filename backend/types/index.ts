import * as cheerio from "cheerio"
// API Request/Response Types
export interface FFVBParams {
    saison: string
    codent: string
    poule: string
}

export interface CalendarICSParams extends FFVBParams {
    team: string
}

// Calendar Data Types
export interface Match {
    date: string // DD/MM/YY format
    time: string // HH:MM format
    homeTeam: string
    awayTeam: string
    location?: string
    [key: string]: string | undefined // For array-like access during parsing
}

export interface Day {
    matches: Match[]
}

export interface Calendar {
    days: Day[]
}

// Raw parsed data types (from FFVB HTML tables)
export type RawMatchArray = string[]
export type RawDayArray = RawMatchArray[]
export type RawCalendarArray = RawDayArray[]

// Logger types
export interface LoggerInterface {
    error: (err: unknown, msg?: string, location?: string) => void
    info: (info: unknown, location?: string) => void
    log: (info: unknown, location?: string) => void
}

// Cheerio types
export type CheerioElement = cheerio.Cheerio<any>
