import { BPHelper } from './../baseProcedures/baseProcedureHelper';
import { SteppingStoneMapping } from './steppingStoneMapping';
import { SteppingStonePath } from './steppingStonePath';
import { SteppingStoneStep } from './steppingStoneStep';

const directionHorizontal: string = 'HORIZONTAL';
const directionVertical: string = 'VERTICAL';
const directionRight: string = 'RIGHT';
const directionLeft: string = 'LEFT';
const directionUpper: string = 'UPPER';
const directionLower: string = 'LOWER';

export class SteppingStoneHelper {

    // Speichern der einzelnen Iterationen
    public static safeStep(steps: SteppingStoneStep[], changedMatrix: number[][], offerArray: number[], demandArray: number[], totalCosts: number, allDeterminants: Array<string>) {
        let step: SteppingStoneStep = { changedMatrix, offerArray, demandArray, totalCosts, allDeterminants };

        steps.push(JSON.parse(JSON.stringify(step)));
    }


  /**
     * Ermitteln des Minimums aller Kostendifferenten
     * @author Franziska Friese
     * @param {SteppingStonePath[]} elementsOfPath - Pfad und Kostendifferenz aller nicht belegten Felder
     * @returns {number} - Minimum aller Kostendifferenten
     */
    public static findMinimum(elementsOfPath: SteppingStonePath[]): number {
        
        let minimum: number = Number.MAX_VALUE;

        elementsOfPath.forEach(function (element) {
            if (minimum > element.Result) {
                minimum = element.Result;
            }
        });

        return minimum;
    }


    /**
     * Pfad des Minimums ermitteln
     * @author Franziska Friese
     * @param {SteppingStonePath[]} elementsOfPath - Pfad und Kostendifferenz aller nicht belegten Felder
     * @param {number} minimum - ermitteltes Minimum der Kostendifferenten
     * @returns {Array<string[]>} - Pfad des Minimums
     */
    public static getPathOfMinimum(elementsOfPath: SteppingStonePath[], minimum: number): Array<string[]> {
        
        let path: Array<string[]> = null;

        //Pfad von Minimum bekommen:
        elementsOfPath.forEach(function (element) {
            if (minimum === element.Result) {
                path = element.Path;
            }
        });

        return path;
    }

    /**
     * Mengen anhand der Koordinaten des Pfades aus aktueller Matrix ermitteln
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix 
     * @param {Array<string[]>} path - Pfad des Minimums
     * @returns {Array<SteppingStoneMapping>} - Array als Zwischenspeicher mit Mengen des Pfades
     */
    private static getValue(matrix: number[][], path: Array<string[]>): Array<SteppingStoneMapping> {
        
        let list: Array<SteppingStoneMapping> = new Array<SteppingStoneMapping>();

        for (var i: number = 0; i < path.length; i++) {
            let x: number = Number.parseInt(path[i][0]);
            let y: number = Number.parseInt(path[i][1]);
            list.push(new SteppingStoneMapping(x, y, matrix[x][y]));
        }

        return list;
    }

    /**
     * Ermitteln der Menge, die maximal verteilt werden kann --> Minimum wird für Mengenverteilung benötigt
     * @author Franziska Friese
     * @param {Array<SteppingStoneMapping>} list - Array als Zwischenspeicher mit Mengen des Pfades
     * @returns {number} - maximale Menge, die verteilt werden kann
     */
    private static findMinimumAllocatedValue(list: Array<SteppingStoneMapping>): number {
        
        let minimumAllocatedValue: number = Number.MAX_VALUE;

        for (var i: number = 0; i < list.length; i++) {
            let element: SteppingStoneMapping = list[i];
            let value = element.Value;
            
            if (i % 2 !== 0) {
               
                if (minimumAllocatedValue > value && value != null) {
                    minimumAllocatedValue = value;
                }
            }
        }

        return minimumAllocatedValue;
    }

    /**
     * Mengenverteilung - Berechnen der neuen Mengen nach dem +/- - Algorithmus
     * @author Franziska Friese
     * @param {Array<SteppingStoneMapping>} list - Array als Zwischenspeicher mit Mengen des Pfades
     * @param {number} minimumAllocatedValue - maximalste Menge, die verteilt werden darf
     * @returns {Array<SteppingStoneMapping>} - Array als Zwischenspeicher mit veränderten Mengen
     */
    public static distributeQuantities(list: Array<SteppingStoneMapping>, minimumAllocatedValue: number): Array<SteppingStoneMapping> {
        for (var i: number = 0; i < list.length; i++) {
            let element: SteppingStoneMapping = list[i];
            if (i % 2 !== 0) {
                element.value -= minimumAllocatedValue;
            }
            else {
                element.value += minimumAllocatedValue;
            }
        }

        return list;
    }

    /**
     * Überprüfung, ob eine Degeneration vorliegt
     * Degeneration (= wenn nach Mengenverteilung mehr als 1 belegtes Feld eine 0 aufweist)
     * @author Franziska Friese
     * @param {Array<SteppingStoneMapping>} list - Array als Zwischenspeicher mit veränderten Mengen des Pfades
     * @returns {boolean, number} - boolean: ist Degeneration eingetreten? ; check: Anzahl der 0
     */
    private static checkDegeneracy(list: Array<SteppingStoneMapping>) {

        let check: boolean = false;
        let count: number = 0;

        for (var i: number = 0; i < list.length; i++) {
            let element: SteppingStoneMapping = list[i];
            if (element.Value === 0) count++;
        }

        if (count > 1) {
            check = true;
        } else {
            check = false;
        }
 
        return { check, count };
    }

    /**
     * Menge, die auf 0 gesetzt wurde, muss nun auf null gesetzt werden
     * Ausnahme: Degeneration ist eingetreten 
     * @author Franziska Friese
     * @param {boolean} check - Überprüfung, ob Degeneration eingetreten ist 
     * @param {number} amountOf0 - Anzahl der Mengen, die auf 0 gesetzt wurden
     * @param {Array<SteppingStoneMapping>} list - Array als Zwischenspeicher mit veränderten Mengen des Pfades
     * @returns {Array<SteppingStoneMapping>} - Array als Zwischenspeicher mit veränderten Mengen des Pfades
     */
    private static change0ToNull(check: boolean, amountOf0: number, list: Array<SteppingStoneMapping>): Array<SteppingStoneMapping> {
       
        //1x 0 muss zwingend auf null gesetzt werden (= Feld des zuvor ermittelten Mengenminimums)
        amountOf0 -= 1;

        if (check === false) {
            for (var i: number = 0; i < list.length; i++) {
                let element: SteppingStoneMapping = list[i];
                if (element.Value === 0) element.value = null;
            }
        }
        else {
            let count: number = 0;
            for (var i: number = 0; i < list.length; i++) {
                let element: SteppingStoneMapping = list[i];
                if (count < amountOf0) {
                    if (element.Value == 0) {
                        count++;
                        continue;
                    }
                }
                else if (count === amountOf0) {
                    if (element.Value == 0) {
                        element.value = null;
                    }
                }
            }
        }

        return list;
    }

    /**
     * Werte aller belegten Felder in neu generierte Matrix schreiben
     * @author Franziska Friese
     * @param {number[][]} newMatrix - neue Mengenmatrix
     * @param {Array<SteppingStoneMapping>} list - Array als Zwischenspeicher mit veränderten Mengen des Pfades
     * @returns {number[][]} - neu befüllte Mengenmatrix
     */
    private static writeValuesInNewMatrix(newMatrix: number[][], list: Array<SteppingStoneMapping>): number[][] {
        let numberOfOffer: number = 0;
        let numberOfDemand: number = 0;

        for (var i = 0; i < list.length; i++) {
            let element: SteppingStoneMapping = list[i];
            numberOfOffer = element.X;
            numberOfDemand = element.Y;
            newMatrix[numberOfOffer][numberOfDemand] = element.Value;
        }

        return newMatrix;
    }

    /**
     * Mengenverteilung innerhalb des Stepping-Stone-Verfahrens
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix
     * @param {Array<string[]} path - Pfad des Minimums
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {number[][]} - neu befüllte Mengenmatrix
     */
    public static distribution(matrix: number[][], path: Array<string[]>, lengthOffer: number, lengthDemand: number): number[][] {
       
        //neue Matrix generieren 
        let newMatrix: number[][] = BPHelper.createMatrix(lengthOffer, lengthDemand);

        //Hilfs-Array mit allen belegten Mengen
        let quantities: Array<SteppingStoneMapping> = [];
        for (var offer: number = 0; offer < lengthOffer; offer++) {
            for (var demand: number = 0; demand < lengthDemand; demand++) {
                if (matrix[offer][demand] !== null) {
                    quantities.push(new SteppingStoneMapping(offer, demand, matrix[offer][demand]));
                }
            }
        }

        //Liste mit Mengen aus Pfad füllen
        let list: Array<SteppingStoneMapping> = this.getValue(matrix, path);

        //minimalster Wert für Verteilung suchen
        let minimumAllocatedValue: number = this.findMinimumAllocatedValue(list);

        //Mengen aufsummieren bzw. subtrahieren
        list = this.distributeQuantities(list, minimumAllocatedValue);

        //Überprüfung, ob Degeneration eintritt
        let checkDegeneracy = this.checkDegeneracy(list);
        let check : boolean = checkDegeneracy['check'];
        let amountOf0 : number = checkDegeneracy['count'];

        //Menge mit 0 müssen auf null gesetzt werden bzw. bei Degeneration 0 stehen lassen
        list = this.change0ToNull(check, amountOf0, list);

        //Quantities (= Liste mit allen befüllten Felder) muss mit verteilten Mengen angepasst werden
        for (var i: number = 0; i < quantities.length; i++) {
            if (list[i] != undefined) {
                if (list[i].X === quantities[i].X && list[i].Y === quantities[i].Y) {
                    quantities[i].value = list[i].Value;
                }
                else {
                    quantities.push(list[i]);
                }
            }
        }

        //neu Matrix mit veränderten Mengen befüllen
        newMatrix = this.writeValuesInNewMatrix(newMatrix, quantities);

        //Überprüfung, ob Matrix gegen die Regel n + m -1 verstößt
        this.checkRuleOfOccupiedFields(newMatrix, lengthOffer, lengthDemand);

        return newMatrix;
    }


    /**
     * Überprüfung, ob ein Verstoß gegen die Regel "n + m - 1" vorliegt
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix 
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {void}
     */
    public static checkRuleOfOccupiedFields(matrix: number[][], lengthOffer: number, lengthDemand: number): void {
        
        let count: number = 0;
        for (var offer: number = 0; offer < lengthOffer; offer++) {
            for (var demand: number = 0; demand < lengthDemand; demand++) {
                if (matrix[offer][demand] !== null) count++;
            }
        }
        let rule = lengthOffer + lengthDemand - 1;
        
        if (count !== rule)
        {
            alert('Die Matrix verstößt gegen die Regel n + m - 1!');
            throw Error("Die Matrix verstößt gegen die Regel n + m - 1!");
        }
    }

    /**
     * Überprüfung, ob ein Verstoß gegen die 1. Nebenbedingung vorliegt
     * 1. Nebenbedingung: Summe x(ij) = a(i)
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix
     * @param {number[]} demandArray - Bedarfs Array
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {void}
     */
    public static checkConstraintColumns(matrix: number[][], demandArray: number[], lengthOffer: number, lengthDemand: number): void {

        for (var demand: number = 0; demand < lengthDemand; demand++) {
            let sum: number = 0;
            for (var offer: number = 0; offer < lengthOffer; offer++) {
                sum += matrix[offer][demand];
            }

            if (sum !== demandArray[demand])
            {
                alert('Die Nebenbedingung 1 wurde verletzt!');
                throw Error("Die Nebenbedingung 1 wurde verletzt!");
            };
            sum = 0;
        }
    }

    /**
     * Überprüfung, ob ein Verstoß gegen die 2. Nebenbedingung vorliegt
     * 2. Nebenbedingung: Summe x(ij) = b(j)
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix
     * @param {number[]} offerArray - Angebots Array
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {void}
     */
    public static checkConstraintRows(matrix: number[][], offerArray: number[], lengthOffer: number, lengthDemand: number): void {

        for (var offer: number = 0; offer < lengthOffer; offer++) {
            let sum: number = 0;
            for (var demand: number = 0; demand < lengthDemand; demand++) {
                sum += matrix[offer][demand];
            }

            if (sum !== offerArray[offer]) {
                alert('Die Nebenbedingung 2 wurde verletzt!');
                throw Error("Die Nebenbedingung 2 wurde verletzt!");
            }
            sum = 0;

        }
    }

    /**
     * Überprüfung, ob ein Verstoß gegen die 3. Nebenbedingung vorliegt
     * 3. Nebenbedingung: Gesamtangebot = Gesamtbedarf
     * @author Franziska Friese
     * @param {number[]} offerArray - Angebots Array
     * @param {number[]} demandArray - Bedarfs Array
     * @returns {void}
     */
    public static checkConstraintSum(offerArray: number[], demandArray: number[]): void {

        let sumOfAllOffers: number = 0;
        let sumOfAllDemands: number = 0;

        for (var i: number = 0; i < offerArray.length; i++) {
            sumOfAllOffers += offerArray[i];
        }

        for (var i: number = 0; i < demandArray.length; i++) {
            sumOfAllDemands += demandArray[i];
        }

        if (sumOfAllDemands !== sumOfAllOffers) {
            alert('Die Summen der Spalten und Zeilen stimmen nicht überein!');
            throw Error("Die Summen der Spalten und Zeilen stimmen nicht überein!");
        };
    }

    /**
     * Überprüfung, ob ein Verstoß gegen die 4. Nebenbedingung vorliegt
     * 4. Nebenbedingung: x(ij) >= 0
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {void}
     */
    public static checkConstraintZero(matrix: number[][], lengthOffer: number, lengthDemand: number): void {

        for (var offer: number = 0; offer < lengthOffer; offer++) {
            for (var demand: number = 0; demand < lengthDemand; demand++) {
                if (matrix[offer][demand] < 0) {
                    alert('Die Nebenbedingung 4 wurde verletzt!');
                    throw Error("Die Nebenbedingung 4 wurde verletzt!");
                }
            }
        }
    }

    /**
     * Überprüfung, ob ein Verstoß gegen alle Nebenbedingungen vorliegt
     * --> vereinfachter Aufruf aller Überprüfungen
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix
     * @param {number[]} offerArray - Angebots Array
     * @param {number[]} demandArray - Bedarfs Array
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {void}
     */
    public static checkAllConstraints(matrix: number[][], offerArray: number[], demandArray: number[], lengthOffer: number, lengthDemand: number): void {

        this.checkConstraintColumns(matrix, demandArray, lengthOffer, lengthDemand);
        this.checkConstraintRows(matrix, offerArray, lengthOffer, lengthDemand);
        this.checkConstraintSum(offerArray, demandArray);
        this.checkConstraintZero(matrix, lengthOffer, lengthDemand);
    }

    /**
     * Berechnung der Gesamttransportkosten einer Matrix
     * @author Franziska Friese
     * @param {number[][]} matrix - Mengenmatrix
     * @param {number[][]} costMatrix - Einheitskostenmatrix
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     */
    public static calculateTotalCostsOfMatrix(matrix: number[][], costMatrix: number[][], lengthOffer: number, lengthDemand: number): number {
        let totalCosts: number = 0;
        let cost: number = 0;

        for (var offer: number = 0; offer < lengthOffer; offer++) {
            for (var demand: number = 0; demand < lengthDemand; demand++) {
                if (matrix[offer][demand] !== null) {
                    cost = matrix[offer][demand] * costMatrix[offer][demand];
                    totalCosts += cost;
                }
            }
        }
        return totalCosts;
    }

    /**
     * Wegefindung der nicht belegten Felder in der Matrix & Ermittlung der zugehörigen Determinanten
     * @author Franziska Dittmeyer 
     * @param {number[][]} matrix - Mengenmatrix
     * @param {number[][]} costMatrix - Einheitskostenmatrix
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {Array<string>()} Kostendifferenzen zur Anzeige für das Frontend
     * @returns {Array<SteppingStonePath>()} Ermittelte Wege mit allen Details 
     */
    public static getPathsAndCostDifferences(matrix: number[][], costMatrix: number[][], lengthOffer: number, lengthDemand: number) {

        let allCostDifferences = Array<string>();
        let allPathDetails = Array<SteppingStonePath>();

        for (var offer = 0; offer < matrix.length; offer++) {
            for (var demand = 0; demand < matrix[offer].length; demand++) {

                if (matrix[offer][demand] == null) {

                    // Pfad zu nicht belegtem Feld ermitteln 
                    let path = this.findPath(matrix, offer, demand, lengthOffer, lengthDemand);

                    // Kosten zu aufgestelltem Pfad ermitteln
                    let costsPerCell = this.determineCostPath(path, costMatrix);

                    // Addieren der Kosten des ermittelten Pfads
                    let totalCosts = this.calculateTotalCosts(costsPerCell);

                    // Pfad-Daten abspeichern 
                    let pathDetails: SteppingStonePath = new SteppingStonePath(offer, demand, path, costsPerCell, totalCosts);

                    // Daten für Ausgabe 
                    let outputLine = pathDetails.createDeterminant();
                    allCostDifferences.push(outputLine);

                    // Daten für Weiterverarbeitung 
                    allPathDetails.push(pathDetails);

                }
            }

        }

        return { allCostDifferences, allPathDetails };

    }

    /**
     * Wegefindung: Pfad zu Feld im 90-Grad-Winkel ermitteln
     * @author Franziska Dittmeyer  
     * @param {number[][]} matrix - Mengenmatrix 
     * @param {number} startPositionOffer - Startposition y-Achse (Angebot) 
     * @param {number} startPositionDemand - Startposition x-Achse (Bedarf)
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @returns {Array} Ermittelter Pfad für eingehendes Feld 
     */
    private static findPath(matrix: number[][], startPositionOffer: number, startPositionDemand: number, lengthOffer: number, lengthDemand: number) {

        let finalPath: Array<string[]> = new Array();
        let currentPositionOffer: number = startPositionOffer;
        let currentPositionDemand: number = startPositionDemand;
        let direction = directionHorizontal;
        let distance: number = 1;
        let lastHorizontalDirection;
        let lastVerticalDirection;
        let nextHorizontalDirection;
        let nextVerticalDirection;

        let response;
        let hasNeighbour: boolean = false;
        let possiblePosOffer: number;
        let possiblePosDemand: number;
        let foundFinalPath = false;
        let distanceExhausted = false;

        let isFieldUnsuitable: boolean = false;
        let isFieldAlreadyInPath: boolean = false;
        let listUnsuitableFields = new Array();
        let lastDeletedElement;

        while (foundFinalPath == false) {

            // Nach nächstem belegten Feld suchen
            response = this.findNextNeighbour(direction, distance, lastHorizontalDirection, lastVerticalDirection, nextHorizontalDirection, nextVerticalDirection, matrix, currentPositionOffer, currentPositionDemand, startPositionOffer, startPositionDemand, lengthOffer, lengthDemand);
            hasNeighbour = response['hasNeighbour'];
            lastHorizontalDirection = response['lastHorizontalDirection'];
            lastVerticalDirection = response['lastVerticalDirection'];
            possiblePosOffer = response['possiblePosOffer'];
            possiblePosDemand = response['possiblePosDemand'];
            foundFinalPath = response['foundFinalPath'];
            distanceExhausted = response['distanceExhausted'];


            // Optimalen Pfad gefunden
            if (foundFinalPath == true) {

                let startElement = new Array(startPositionOffer.toString(), startPositionDemand.toString());
                if (startElement != finalPath[0]) {
                    // Startpunkt an erste Stelle im Array setzen
                    finalPath.unshift(new Array<string>(possiblePosOffer.toString(), possiblePosDemand.toString()));
                }

                foundFinalPath = this.checkIfFinalPath(finalPath, startPositionOffer, startPositionDemand);

            }

            // Kein belegtes Feld mehr in Spalte/Zeile gefunden 
            else if (distanceExhausted == true) {

                if ((nextHorizontalDirection.length != 0) || (nextVerticalDirection.length != 0)) {
                    // Eine feste Richtung zur Suche nach einem belegten Feld ist gesetzt
                    distance += 1;
                } else {

                    // Letztes Element wieder vom Pfad nehmen
                    lastDeletedElement = finalPath.pop();
                    if (lastDeletedElement != undefined) {
                        listUnsuitableFields.push(lastDeletedElement);
                    }

                    // Basisvariable zurücksetzen
                    distance = 1;

                    if (finalPath.length > 0) {

                        // Letztes Element ist neuer Ausgangspunkt
                        let lastElement = finalPath[finalPath.length - 1];
                        if ((!isNaN(Number(lastElement[0]))) && (!isNaN(Number(lastElement[1])))) {
                            currentPositionOffer = Number(lastElement[0]);
                            currentPositionDemand = Number(lastElement[1]);
                        } else {
                            alert('Convert-Error: Element of Matrix ist not a Number');
                        }

                    } else {
                        // Startpunkt ist neuer Ausgangspunkt
                        currentPositionOffer = startPositionOffer;
                        currentPositionDemand = startPositionDemand;
                        distance += 1;
                    }

                    // Richtung ändern im 90-Grad-Winkel 
                    if (direction == directionHorizontal) {
                        direction = directionVertical;
                    } else {
                        direction = directionHorizontal;
                    }
                }

                nextHorizontalDirection = '';
                nextVerticalDirection = '';
            }


            // Nachbarn gefunden 
            else if (hasNeighbour == true) {

                isFieldUnsuitable = this.isFieldUnsuitable(listUnsuitableFields, possiblePosOffer, possiblePosDemand);
                isFieldAlreadyInPath = this.isFieldAlreadyInPath(finalPath, possiblePosOffer, possiblePosDemand);

                if ((isFieldUnsuitable == true) || (isFieldAlreadyInPath == true)) {

                    // Nach weiterem belegtem Feld in gleicher Richtung suchen
                    if (direction == directionHorizontal) {
                        if (lastHorizontalDirection == directionRight) {
                            nextHorizontalDirection = directionLeft;
                        } else {
                            nextHorizontalDirection = directionRight;
                        }
                    } else {
                        if (lastVerticalDirection == directionUpper) {
                            nextVerticalDirection = directionLower;
                        } else {
                            nextVerticalDirection = directionUpper;
                        }
                    }

                } else {

                    finalPath.push(new Array<string>(possiblePosOffer.toString(), possiblePosDemand.toString()));

                    // Gefundenes Feld ist neuer Ausgangspunkt
                    currentPositionOffer = possiblePosOffer;
                    currentPositionDemand = possiblePosDemand;

                    // Richtung ändern im 90-Grad-Winkel
                    if (direction == directionHorizontal) {
                        direction = directionVertical;
                    } else {
                        direction = directionHorizontal;
                    }

                    // Basisvariablen zurücksetzen
                    distance = 1;
                    nextVerticalDirection = '';
                    nextHorizontalDirection = '';
                }


                // Kein belegtes Feld gefunden
            } else {
                distance += 1;
                nextVerticalDirection = '';
                nextHorizontalDirection = '';
            }
        }

        return finalPath;

    }

    /**
    * Suchen des nächsten belegten Feldes in Zeile/Spalte
    * @author Franziska Dittmeyer
    * @param {string} direction - Richtung angeben in die gesucht werden soll 
    * @param {number} distance - Entfernung  
    * @param {string} lastHorizontalDirection - Letzte horizontale Richtung in der belegtes Feld gefunden wurde
    * @param {string} lastVerticalDirection - Letzte vertikale Richtung in der belegtes Feld gefunden wurde
    * @param {string} nextHorizontalDirection - Nächste horizontale Richtung in der belegtes Feld gesucht werden soll
    * @param {string} nextVerticalDirection - Nächste vertikale Richtung in der belegtes Feld gesucht werden soll
    * @param {number[][]} matrix - Mengenmatrix 
    * @param {number} offer -  Wert x-Achse aktuelles Feld (Angebot)
    * @param {number} demand - Wert y-Achse aktuelles Feld (Bedarf)
    * @param {number} startOffer - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot)  
    * @param {number} startDemand - Wert y-Achse des nicht belegten Feldes/Startpunktes (Bedarf)
    * @param {number} lengthOffer - Anzahl Angebotsorte 
    * @param {number} lengthDemand  - Anzahl Bedarfsorte
    * @returns {boolean} foundFinalPath ist true, wenn Start Zeile/Spalte erreicht ist 
    * @returns {boolean} hasNeighbour ist true, wenn Nachbar unter Eingangsbedingungen gefunden wurde
    * @returns {boolean} distanceExhausted ist true, wenn kein belegtes Feld in Zeile/Spalte gefunden wurde
    * @returns {string} lastHorizontalDirection 
    * @returns {string} lastVericalDirection 
    * @returns {number} possiblePosOffer ist mit x-Koordinate des gefundenen Feldes belegt
    * @returns {number} possiblePosDemand ist mit y-Koordinate des gefundenen Feldes belegt 
    */
    private static findNextNeighbour(direction: string, distance: number, lastHorizontalDirection: string, lastVerticalDirection: string, nextHorizontalDirection: string, nextVerticalDirection: string, matrix: number[][], offer: number, demand: number, startOffer: number, startDemand: number, lengthOffer: number, lengthDemand: number) {

        let response;
        let hasNeighbour: boolean = false;
        let possiblePosOffer = offer;
        let possiblePosDemand = demand;
        let foundFinalPath = false;
        let distanceExhausted = false;

        // Suche Nachbar in horizontale Richtung bzw. Zeile
        if (direction == directionHorizontal) {
            response = this.findNeighbourHorizontal(distance, lastHorizontalDirection, nextHorizontalDirection, matrix, offer, demand, startOffer, startDemand, lengthDemand);
            lastHorizontalDirection = response['lastHorizontalDirection'];
            possiblePosDemand = response['possiblePosDemand'];
        }

        // Suche Nachbar in vertikale Richtung bzw. Spalte
        else if (direction == directionVertical) {
            response = this.findNeighbourVertical(distance, lastVerticalDirection, nextVerticalDirection, matrix, offer, demand, startOffer, startDemand, lengthOffer);
            lastVerticalDirection = response['lastVerticalDirection'];
            possiblePosOffer = response['possiblePosOffer'];
        }

        else {
            throw Error("Keine Richtung angegeben, um nach Nachbarn zu suchen!");
        }

        hasNeighbour = response['hasNeighbour'];
        foundFinalPath = response['foundFinalPath'];
        distanceExhausted = response['distanceExhausted'];
        return { foundFinalPath, hasNeighbour, distanceExhausted, lastHorizontalDirection, lastVerticalDirection, possiblePosOffer, possiblePosDemand };

    }
    /**
         * Suche das nächste belegte Feld in der Zeile
         * @author Franziska Dittmeyer
         * @param {number} distance - Entfernung 
         * @param {string} lastHorizontalDirection - Letzte horizontale Richtung in der belegtes Feld gefunden wurde
         * @param {string} nextHorizontalDirection - Letzte vertikale Richtung in der belegtes Feld gefunden wurde
         * @param {number[][]} matrix - Mengenmatrix 
         * @param {number} offer -  Wert x-Achse aktuelles Feld (Angebot)
         * @param {number} demand - Wert y-Achse aktuelles Feld (Bedarf)
         * @param {number} startOffer - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot)  
         * @param {number} startDemand - Wert y-Achse des nicht belegten Feldes/Startpunktes (Bedarf)
         * @param {number} lengthDemand  - Anzahl Bedarfsorte
         * @returns {boolean} foundFinalPath ist true, wenn Start Zeile/Spalte erreicht ist 
         * @returns {boolean} hasNeighbour ist true, wenn Nachbar unter Eingangsbedingungen gefunden wurde
         * @returns {boolean} distanceExhausted ist true, wenn kein belegtes Feld in Zeile/Spalte gefunden wurde
         * @returns {string} lastHorizontalDirection
         * @returns {number} possiblePosDemand ist mit y-Koordinate des gefundenen Feldes belegt 
         */
    private static findNeighbourHorizontal(distance: number, lastHorizontalDirection: string, nextHorizontalDirection: string, matrix: number[][], offer: number, demand: number, startOffer: number, startDemand: number, lengthDemand: number) {

        let response;
        let hasNeighbour: boolean = false;
        let possiblePosDemand = demand;
        let foundFinalPath = false;
        let distanceExhausted = false;
        let rightDistanceExhausted = false;
        let leftDistanceExhausted = false;

        if (nextHorizontalDirection == directionRight) {
            response = this.findNeighbourRight(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand, lengthDemand);
            hasNeighbour = response['hasNeighbour'];
            distanceExhausted = response['distanceExhausted'];
            foundFinalPath = response['foundFinalPath'];
            possiblePosDemand = response['possiblePosDemand'];
            lastHorizontalDirection = response['lastHorizontalDirection'];
        }

        else if (nextHorizontalDirection == directionLeft) {
            response = this.findNeighbourLeft(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand);
            hasNeighbour = response['hasNeighbour'];
            distanceExhausted = response['distanceExhausted'];
            foundFinalPath = response['foundFinalPath'];
            possiblePosDemand = response['possiblePosDemand'];
            lastHorizontalDirection = response['lastHorizontalDirection'];
        }

        else {

            response = this.findNeighbourRight(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand, lengthDemand);
            hasNeighbour = response['hasNeighbour'];
            rightDistanceExhausted = response['distanceExhausted'];
            foundFinalPath = response['foundFinalPath'];
            possiblePosDemand = response['possiblePosDemand'];
            lastHorizontalDirection = response['lastHorizontalDirection'];

            if ((hasNeighbour == false) && (foundFinalPath == false)) {
                response = this.findNeighbourLeft(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand);
                hasNeighbour = response['hasNeighbour'];
                leftDistanceExhausted = response['distanceExhausted'];
                foundFinalPath = response['foundFinalPath'];
                possiblePosDemand = response['possiblePosDemand'];
                lastHorizontalDirection = response['lastHorizontalDirection'];
            }

            if ((rightDistanceExhausted == true) && (leftDistanceExhausted == true)) distanceExhausted = true;
        }

        return { foundFinalPath, hasNeighbour, distanceExhausted, lastHorizontalDirection, possiblePosDemand };

    }

    /**
    * Schauen, ob es ein belegtes Feld rechts Ausgangspunkt gibt
    * @author Franziska Dittmeyer
    * @param {number[][]} matrix - Mengenmatrix 
    * @param {number} possiblePosDemand y-Koordinate des gefundenen Feldes 
    * @param {string} lastHorizontalDirection 
    * @param {number} distance Entfernung
    * @param {number} offer -  Wert x-Achse aktuelles Feld (Angebot)
    * @param {number} demand - Wert y-Achse aktuelles Feld (Bedarf)
    * @param {number} startOffer - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot) 
    * @param {number} startDemand - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot)  
    * @param {number} lengthDemand - Anzahl Bedarfsorte 
    * @returns {boolean} hasNeighbour ist true, wenn Nachbar unter Eingangsbedingungen gefunden wurde
    * @returns {boolean} distanceExhausted ist true, wenn kein belegtes Feld in Zeile/Spalte gefunden wurde
    * @returns {boolean} foundFinalPath ist true, wenn Start Zeile/Spalte erreicht ist 
    * @returns {number} possiblePosDemand ist mit y-Koordinate des gefundenen Feldes belegt
    * @returns {string} lastHorizontalDirection 
    */
    private static findNeighbourRight(matrix: number[][], possiblePosDemand: number, lastHorizontalDirection: string, 
        distance: number, offer: number, demand: number, startOffer: number, startDemand: number, lengthDemand: number) {

        let hasNeighbour: boolean = false;
        let distanceExhausted: boolean = false;
        let foundFinalPath: boolean = false;

        if ((demand + distance) < lengthDemand) {

            // Schauen, ob der Startpunkt rechts in der Zeile von mir ist
            let internCounter = distance;
            while (((demand + internCounter) < lengthDemand) && (foundFinalPath == false)) {
                if ((offer == startOffer) && ((demand + internCounter) == startDemand)) {
                    foundFinalPath = true;
                    possiblePosDemand = demand + internCounter;
                }
                internCounter++;
            }

            // Startpunkt nicht in meiner Zeile -> Schauen, ob ich Nachbarn habe
            if (foundFinalPath == false) {
                if (matrix[offer][demand + distance] != null) {
                    hasNeighbour = true;
                    lastHorizontalDirection = directionRight;
                    possiblePosDemand = demand + distance;
                }

            }
        } else {
            distanceExhausted = true;
        }

        return { hasNeighbour, distanceExhausted, foundFinalPath, possiblePosDemand, lastHorizontalDirection };

    }

    /**
     * Schauen, ob es ein belegtes Feld links Ausgangspunkt gibt
     * @author Franziska Dittmeyer
     * @param {number[][]} matrix - Mengenmatrix 
     * @param {number} possiblePosDemand y-Koordinate des gefundenen Feldes 
     * @param {string} lastHorizontalDirection 
     * @param {number} distance Entfernung
     * @param {number} offer -  Wert x-Achse aktuelles Feld (Angebot)
     * @param {number} demand - Wert y-Achse aktuelles Feld (Bedarf)
     * @param {number} startOffer - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot) 
     * @param {number} startDemand - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot)  
     * @returns {boolean} hasNeighbour ist true, wenn Nachbar unter Eingangsbedingungen gefunden wurde
     * @returns {boolean} distanceExhausted ist true, wenn kein belegtes Feld in Zeile/Spalte gefunden wurde
     * @returns {boolean} foundFinalPath ist true, wenn Start Zeile/Spalte erreicht ist 
     * @returns {number} possiblePosDemand ist mit y-Koordinate des gefundenen Feldes belegt
     * @returns {string} lastHorizontalDirection 
     */
    private static findNeighbourLeft(matrix: number[][], possiblePosDemand: number, lastHorizontalDirection: string, distance: number, offer: number, demand: number, startOffer: number, startDemand: number) {

        let hasNeighbour: boolean = false;
        let distanceExhausted: boolean = false;
        let foundFinalPath: boolean = false;

        if ((demand - distance) >= 0) {

            // Schauen, ob der Startpunkt links in der Zeile von mir ist
            let internCounter = distance;
            while (((demand - internCounter) >= 0) && (foundFinalPath == false)) {
                if ((offer == startOffer) && ((demand - internCounter) == startDemand)) {
                    foundFinalPath = true;
                    possiblePosDemand = demand - internCounter;
                }
                internCounter++;
            }

            // Startpunkt nicht in meiner Zeile -> Schauen, ob ich Nachbarn habe
            if (foundFinalPath == false) {
                if (matrix[offer][demand - distance] != null) {
                    hasNeighbour = true;
                    lastHorizontalDirection = directionLeft;
                    possiblePosDemand = demand - distance;
                }
            }

        } else {
            distanceExhausted = true;
        }

        return { hasNeighbour, distanceExhausted, foundFinalPath, possiblePosDemand, lastHorizontalDirection };
    }

    /**
     * Suche das nächste belegte Feld in der Spalte
     * @author Franziska Dittmeyer
     * @param {number} distance - Entfernung 
     * @param {string} lastVerticalDirection - Letzte vertikale Richtung in der belegtes Feld gefunden wurde
     * @param {string} nextVerticalDirection - Letzte vertikale Richtung in der belegtes Feld gefunden wurde
     * @param {number[][]} matrix - Mengenmatrix 
     * @param {number} offer -  Wert x-Achse aktuelles Feld (Angebot)
     * @param {number} demand - Wert y-Achse aktuelles Feld (Bedarf)
     * @param {number} startOffer - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot)  
     * @param {number} startDemand - Wert y-Achse des nicht belegten Feldes/Startpunktes (Bedarf)
     * @param {number} lengthOffer - Anzahl Angebotsorte 
     * @returns {boolean} foundFinalPath ist true, wenn Start Zeile/Spalte erreicht ist 
     * @returns {boolean} hasNeighbour ist true, wenn Nachbar unter Eingangsbedingungen gefunden wurde
     * @returns {boolean} distanceExhausted ist true, wenn kein belegtes Feld in Zeile/Spalte gefunden wurde
     * @returns {string} lastVerticalDirection
     * @returns {number} possiblePosOffer ist mit y-Koordinate des gefundenen Feldes belegt 
     */
    private static findNeighbourVertical(distance: number, lastVerticalDirection: string, nextVerticalDirection: string, matrix: number[][], offer: number, demand: number, startOffer: number, startDemand: number, lengthOffer: number) {

        let response;
        let possiblePosOffer = offer;
        let hasNeighbour: boolean = false;
        let foundFinalPath: boolean = false;
        let distanceExhausted: boolean = false;
        let upperDistanceExhausted: boolean = false;
        let lowerDistanceExhausted: boolean = false;

        if (nextVerticalDirection == directionUpper) {
            response = this.findNeighbourUpper(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand);
            hasNeighbour = response['hasNeighbour'];
            distanceExhausted = response['distanceExhausted'];
            foundFinalPath = response['foundFinalPath'];
            possiblePosOffer = response['possiblePosOffer'];
            lastVerticalDirection = response['lastVerticalDirection'];
        }

        else if (nextVerticalDirection == directionLower) {
            response = this.findNeighbourLower(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand, lengthOffer);
            hasNeighbour = response['hasNeighbour'];
            distanceExhausted = response['distanceExhausted'];
            foundFinalPath = response['foundFinalPath'];
            possiblePosOffer = response['possiblePosOffer'];
            lastVerticalDirection = response['lastVerticalDirection'];
        }

        else {
            response = this.findNeighbourUpper(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand);
            hasNeighbour = response['hasNeighbour'];
            upperDistanceExhausted = response['distanceExhausted'];
            foundFinalPath = response['foundFinalPath'];
            possiblePosOffer = response['possiblePosOffer'];
            lastVerticalDirection = response['lastVerticalDirection'];

            if ((hasNeighbour == false) && (foundFinalPath == false)) {
                response = this.findNeighbourLower(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand, lengthOffer);
                hasNeighbour = response['hasNeighbour'];
                lowerDistanceExhausted = response['distanceExhausted'];
                foundFinalPath = response['foundFinalPath'];
                possiblePosOffer = response['possiblePosOffer'];
                lastVerticalDirection = response['lastVerticalDirection'];
            }

            if ((upperDistanceExhausted == true) && (lowerDistanceExhausted == true)) distanceExhausted = true;
        }

        return { foundFinalPath, hasNeighbour, distanceExhausted, lastVerticalDirection, possiblePosOffer };

    }

    /**
    * Schauen, ob es ein belegtes Feld oberhalb Ausgangspunkt gibt
    * @author Franziska Dittmeyer
    * @param {number[][]} matrix - Mengenmatrix 
    * @param {number} possiblePosOffer x-Koordinate des gefundenen Feldes 
    * @param {string} lastVerticalDirection 
    * @param {number} distance Entfernung
    * @param {number} offer -  Wert x-Achse aktuelles Feld (Angebot)
    * @param {number} demand - Wert y-Achse aktuelles Feld (Bedarf)
    * @param {number} startOffer - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot) 
    * @param {number} startDemand - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot)  
    * @returns {boolean} hasNeighbour ist true, wenn Nachbar unter Eingangsbedingungen gefunden wurde
    * @returns {boolean} distanceExhausted ist true, wenn kein belegtes Feld in Zeile/Spalte gefunden wurde
    * @returns {boolean} foundFinalPath ist true, wenn Start Zeile/Spalte erreicht ist 
    * @returns {number} possiblePosOffer ist mit x-Koordinate des gefundenen Feldes belegt
    * @returns {string} lastVerticalDirection 
    */
    private static findNeighbourUpper(matrix: number[][], possiblePosOffer: number, lastVerticalDirection: string, distance: number, offer: number, demand: number, startOffer: number, startDemand: number) {

        let hasNeighbour: boolean = false;
        let distanceExhausted: boolean = false;
        let foundFinalPath: boolean = false;

        if ((offer - distance) >= 0) {

            // Schauen, ob der Startpunkt oberhalb in der Spalte von mir ist
            let internCounter = distance;
            while (((offer - internCounter) >= 0) && (foundFinalPath == false)) {
                if (((offer - internCounter) == startOffer) && (demand == startDemand)) {
                    foundFinalPath = true;
                    possiblePosOffer = offer - internCounter;
                }
                internCounter++;
            }

            // Startpunkt nicht in meiner Zeile -> Schauen, ob ich Nachbarn habe
            if (foundFinalPath == false) {
                if (matrix[offer - distance][demand] != null) {
                    hasNeighbour = true;
                    lastVerticalDirection = directionUpper;
                    possiblePosOffer = offer - distance;
                }
            }
        } else {
            distanceExhausted = true;
        }

        return { hasNeighbour, distanceExhausted, foundFinalPath, possiblePosOffer, lastVerticalDirection };
    }

    /**
     * Schauen, ob es ein belegtes Feld unterhalb Ausgangspunkt gibt
     * @author Franziska Dittmeyer
     * @param {number[][]} matrix - Mengenmatrix 
     * @param {number} possiblePosOffer x-Koordinate des gefundenen Feldes 
     * @param {string} lastVerticalDirection 
     * @param {number} distance Entfernung
     * @param {number} offer -  Wert x-Achse aktuelles Feld (Angebot)
     * @param {number} demand - Wert y-Achse aktuelles Feld (Bedarf)
     * @param {number} startOffer - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot) 
     * @param {number} startDemand - Wert x-Achse des nicht belegten Feldes/Startpunktes (Angebot) 
     * @param {number} lengthOffer - Anzahl Angebotsorte 
     * @returns {boolean} hasNeighbour ist true, wenn Nachbar unter Eingangsbedingungen gefunden wurde
     * @returns {boolean} distanceExhausted ist true, wenn kein belegtes Feld in Zeile/Spalte gefunden wurde
     * @returns {boolean} foundFinalPath ist true, wenn Start Zeile/Spalte erreicht ist 
     * @returns {number} possiblePosOffer ist mit x-Koordinate des gefundenen Feldes belegt
     * @returns {string} lastVerticalDirection 
     */
    private static findNeighbourLower(matrix: number[][], possiblePosOffer: number, lastVerticalDirection: string, distance: number, offer: number, demand: number, startOffer: number, startDemand: number, lengthOffer: number) {

        let hasNeighbour: boolean = false;
        let distanceExhausted: boolean = false;
        let foundFinalPath: boolean = false;

        if ((offer + distance) < lengthOffer) {
            // Schauen, ob der Startpunkt unterhalb in der Spalte von mir ist
            let internCounter = distance;
            while (((offer + internCounter) < lengthOffer) && (foundFinalPath == false)) {
                if (((offer + internCounter) == startOffer) && (demand == startDemand)) {
                    foundFinalPath = true;
                    possiblePosOffer = offer + internCounter;
                }
                internCounter++;
            }

            // Startpunkt nicht in meiner Zeile -> Schauen, ob ich Nachbarn habe
            if (foundFinalPath == false) {
                if (matrix[offer + distance][demand] != null) {
                    hasNeighbour = true;
                    lastVerticalDirection = directionLower;
                    possiblePosOffer = offer + distance;
                }
            }
        } else {
            distanceExhausted = true;
        }

        return { hasNeighbour, distanceExhausted, foundFinalPath, possiblePosOffer, lastVerticalDirection };
    }

    /**
     * Prüft, ob das Feld geeignet ist oder nicht für den Pfad
     * @author Franziska Dittmeyer
     * @param {Array} listUnsuitableFields - Array mit Feldern, die nicht geeignet sind für den Pfad
     * @param {number} positionOffer - Wert x-Achse aktuelles Feld (Angebot)
     * @param {number} positionDemand - Wert y-Achse aktuelles Feld (Bedarf)
     * @returns {boolean} isFieldUnsuitable ist true, wenn Feld nicht geeeignet
     */
    private static isFieldUnsuitable(listUnsuitableFields: Array<string[]>, positionOffer: number, positionDemand: number): boolean {

        let isFieldUnsuitable = false;

        listUnsuitableFields.forEach(function (field) {
            if ((field[0] == positionOffer.toString()) && (field[1] == positionDemand.toString())) {
                isFieldUnsuitable = true;
            }
        })

        return isFieldUnsuitable;

    }
    /**
     * Prüft, ob das Feld bereits im gefundenen Pfad enthalten ist
     * @author Franziska Dittmeyer
     * @param {Array} finalPath - Array mit aktuellem Pfad
     * @param {number} positionOffer - Wert x-Achse aktuelles Feld (Angebot)
     * @param {number} positionDemand - Wert y-Achse aktuelles Feld (Bedarf)
     * @returns {boolean} isFieldAlreadyInPath ist true, wenn Feld bereits im Pfad enthalten ist
     */
    private static isFieldAlreadyInPath(finalPath: Array<string[]>, positionOffer: number, positionDemand: number): boolean {

        let isFieldAlreadyInPath = false;

        finalPath.forEach(function (field) {
            if ((field[0] == positionOffer.toString()) && (field[1] == positionDemand.toString())) {
                isFieldAlreadyInPath = true;
            }
        })

        return isFieldAlreadyInPath;
    }

    /**
     * Prüft, ob alle Kriterien erfüllt sind, dass es sich um einen finalen Pfad handeln kann
     * @author Franziska Dittmeyer
     * @param {Array} path - Array mit aktuellem Pfad
     * @param {number} startOffer - Wert x-Achse des unbelegten Feldes (Angebot)
     * @param {number} startDemand - Wert y-Achse des unbelegten Feldes (Bedarf)
     * @returns {boolean} true, wenn alle Kritierien erfüllt - false, wenn mind. eines der Kriterien nicht erfüllt ist
     */
    private static checkIfFinalPath(path: Array<string[]>, startOffer: number, startDemand: number): boolean {

        let pathLength = path.length;
        let firstField = path[0];

        // Mind. 4 Einträge
        if (pathLength >= 4) {

            // Gerade Anzahl
            if (pathLength % 2 == 0) {

                if ((firstField[0] == startOffer.toString()) && (firstField[1] == startDemand.toString())) {
                    return true;
                }
                else { return false }
            }
            else { return false }
        }
        else { return false }

    }

    /**
     * Ermittlung der Kosten eines anhand eines Pfades für eine DeterminanteF
     * @author Franziska Dittmeyer
     * @param {Array} path - Mengenmatrix
     * @param {Array} costMatrix - Einheitskostenmatrix
     * @returns {Array} Kosten aus Kostenmatrix zu ermittelten Feldern
     */
    private static determineCostPath(path: Array<string[]>, costMatrix: number[][]): number[] {

        var costPerCell = new Array<number>();
        let fieldCost: number;

        path.forEach(function (field) {
            //field.toString().split(",");
            fieldCost = costMatrix[field[0]][field[1]];
            costPerCell.push(fieldCost);
        })

        return costPerCell;
    }

    /**
     * Berechnung der Gesamtkosten einer Determinante
     * @author Franziska Dittmeyer
     * @param {Array} costPerField - Kosten jedes Felders in einem Array
     * @returns {number} Gesamtkosten des Pfads
     */
    private static calculateTotalCosts(costPerField: number[]): number {

        let totalCosts = 0;
        let counter = 0;

        costPerField.forEach(function (element) {
            if ((counter % 2) > 0) {
                totalCosts -= element.valueOf();
            } else {
                totalCosts += element.valueOf();
            }

            counter++;
        })

        return totalCosts;
    }

}