import * as cheerio from 'cheerio';
import logger from "./logger";

export function queryTableTeamsToArray(table: cheerio.Cheerio<any>): string[] | false {
    let arrayTable: string[] = []
    try {
        // Parcourir toutes les lignes du tbody
        table.find('tr').each((i, row) => {
            const cells = cheerio.load(row)('td');
            
            // Ignorer la première ligne (en-têtes)
            if (i === 0) return;
            
            // Récupérer le nom de l'équipe dans la 2ème colonne (index 1)
            const teamName = cells.eq(1).text().trim();
            
            if (teamName) {
                arrayTable.push(teamName);
            }
        });
        
        return arrayTable;
    } catch (e) {
        logger.error(e, "Error while parsing", "queryTableTeamsToArray");
        return false
    }
}

export function queryTableCalendarToArray(table: cheerio.Cheerio<any>): string[][][] | false {
    let arrayTable: any[][][] = []
    let dayArray: any[][] = []
    try {
        // Parcourir toutes les lignes du tableau
        table.find('tr').each((i, row) => {
            const $ = cheerio.load(row);
            const cells = $('td');
            
            // Si la ligne a seulement 1 cellule, c'est un séparateur de journée
            if (cells.length === 1) {
                if (dayArray.length > 0) {
                    arrayTable.push(dayArray);
                    dayArray = [];
                }
                return; // continue
            }
            
            // Extraire les données de chaque cellule
            let tdArray: any[] = [];
            cells.each((j, cell) => {
                const $cell = $(cell);
                
                // Vérifier si la cellule contient un formulaire
                const form = $cell.find('form');
                if (form.length > 0) {
                    // peculiar thing the table seen by the user is not the same
                    // as the one sent by the request (on the ffvb website)
                    const inputValue = form.find('input[name="equipe"]').val();
                    tdArray.push(inputValue ? String(inputValue) : "");
                } else {
                    const text = $cell.text().trim();
                    tdArray.push(text ? text : "");
                }
            });
            
            if (tdArray.length > 0) {
                dayArray.push(tdArray);
            }
        });
        
        // Ajouter le dernier jour s'il existe
        if (dayArray.length > 0) {
            arrayTable.push(dayArray);
        }
        
        return arrayTable;
    } catch (e) {
        logger.error(e, "Error while parsing", "queryTableCalendarToArray");
        return false
    }
}

