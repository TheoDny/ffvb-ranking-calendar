export const getUrl = (saison: string, codent: string, poule: string) => {
    const url_ffvb = process.env.URL_FFVB;
    return `${url_ffvb}?saison=${saison}&codent=${codent}&poule=${poule}`
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
