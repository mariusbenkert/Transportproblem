import { SteppingStoneHelper } from '@procedures/steppingStoneProcedures/steppingStoneHelper';
import { SteppingStoneMapping } from '@procedures/steppingStoneProcedures/steppingStoneMapping';
import { SteppingStonePath } from '@procedures/steppingStoneProcedures/steppingStonePath';
import { BPHelper } from '@procedures/baseProcedures/baseProcedureHelper';


   /**
 * Nebenbedinung 1 soll fehlschlagen
 *@author Franziska Friese
 */
describe('Überprüfung der Nebenbedingung 1', function() {

    it("Fehlerfall, Nebenbedigung 1 wurde verletzt - die Summe eines Bedarfsorts stimmt nicht mit den verteilten Mengen des Bedarfsorts überein", function() {
        let matrix : number[][] = [[10, 10, null, null], 
                                  [null, 15, 10, null], 
                                  [null, null, 5, 35]];
        let lengthOffer : number = matrix.length;
        let lengthDemand : number = matrix[0].length;
        let demandArray : number[] = [10, 25, 15, 85];

        expect(() => {
            //@ts-ignore
            SteppingStoneHelper.checkConstraintColumns(matrix, demandArray, lengthOffer, lengthDemand);
        }).toThrowError("Die Nebenbedingung 1 wurde verletzt!");
    });
});

/**
 * Nebenbedingung 2 soll fehlschlagen
 * @author Franziska Friese
 */
describe('Überprüfung der Nebenbedingung 2', function() {

    it("Fehlerfall, Nebenbedigung 2 wurde verletzt - die Summe eines Angebotsortes stimmt nicht mit den verteilten Mengen des Angebots überein", function() {
       let matrix : number[][] = [[10, 10, null, null], 
                                [null, 15, 10, null], 
                                [null, null, 5, 35]];
       let lengthOffer : number = matrix.length;
       let lengthDemand : number = matrix[0].length;
       let offerArray : number[] = [30, 25, 40];

        expect(() => {
            //@ts-ignore
            SteppingStoneHelper.checkConstraintRows(matrix, offerArray, lengthOffer, lengthDemand);
        }).toThrowError("Die Nebenbedingung 2 wurde verletzt!");
    });

});

/**
 * Nebenbedingung 3 soll fehlschlagen
 * @author Franziska Friese
 */
describe('Überprüfung der Nebenbedingung 3', function() {

    it("Fehlerfall, die Gesamtsumme der Angebote stimmt nicht mit der Gesamtsumme der Bedarfe überein", function() {
       let demandArray : number[] = [10, 25, 15, 35];
       let offerArray : number[] = [20, 90, 40, 150];

        expect(() => {
            //@ts-ignore
            SteppingStoneHelper.checkConstraintSum(offerArray, demandArray);
        }).toThrowError("Die Summen der Spalten und Zeilen stimmen nicht überein!");
    });
});

/**
 * Nebenbedingung 4 soll fehlschlagen
 * @author Franziska Friese
 */
describe('Überprüfung der Nebenbedingung 4', function() {

    it("Fehlerfall, Nebenbedigung 4 wurde verletzt - die Matrix enthält einen negativen Wert", function() {
        
       let matrix : number[][] = [[10, 10, null, null], 
                                  [null, 15, -3, null], 
                                  [null, null, 5, 35]];
       let lengthOffer : number = matrix.length;
       let lengthDemand : number = matrix[0].length;

        expect(() => {
            //@ts-ignore
            SteppingStoneHelper.checkConstraintZero(matrix, lengthOffer, lengthDemand);
        }).toThrowError("Die Nebenbedingung 4 wurde verletzt!");
    });
});

/**
 * Die Gesamtkosten sollen richtig ermittelt werden
 * @author Franziska Friese
 */
describe('Überprüfung der Gesamtkosten', function() {

    it("Gesamtkosten wurden richtig berechnet", function() {
       let quantities : number[][] = [[10, 10, null, null], 
                                      [null, 15, 10, null], 
                                      [null, null, 5, 35]];
       let costMatrix : number[][]= [[1, 8, 4, 7],
                                     [9, 0, 5, 7],
                                     [3, 6, 8, 1]];
       let lengthOffer : number = quantities.length;
       let lengthDemand : number = quantities[0].length;
        expect(215).toEqual(SteppingStoneHelper.calculateTotalCostsOfMatrix(quantities, costMatrix, lengthOffer, lengthDemand));

    })

});

/**
 * Die maximalste Menge, die verteilt werden kann, (= Minimum) soll richrig ermittelt werden
 * @author Franziska Friese
 */
describe('Testen der minimalen Menge', function() {

    it("minimale Menge wurde richtig ermittelt", function() {
        let list: Array<SteppingStoneMapping> = [];
        list.push(new SteppingStoneMapping(3, 1, null));
        list.push(new SteppingStoneMapping(1, 1, 10));
        list.push(new SteppingStoneMapping(1, 2, 10));
        list.push(new SteppingStoneMapping(2, 2, 15));
        list.push(new SteppingStoneMapping(2, 3, 10));
        list.push(new SteppingStoneMapping(3, 3, 5));

        //@ts-ignore
        expect(5).toEqual(SteppingStoneHelper.findMinimumAllocatedValue(list));
    });
});


/**
 * Das Minimum der Determinanten soll richtig ermittelt werden
 * @author Franziska Friese
 */
describe('Überprüfung des richtigen Minimums', function() {

    it("minimalen Determinante wird richtig ermittelt", function() {
        let minimum : number = -9;

        let determinants: Array<SteppingStonePath> = new Array<SteppingStonePath>();
        determinants.push(new SteppingStonePath(3, 1, [["2","0"], ["0","0"], ["0","1"], ["1","1"], ["1","2"], ["2","2"]], [3, 1, 8, 0, 5, 8], 7));
        determinants.push(new SteppingStonePath(2, 1, [["1","0"], ["0","0"], ["0","1"], ["1","1"]], [9, 1, 8, 0], 16));
        determinants.push(new SteppingStonePath(3, 2, [["2","1"], ["1","1"], ["1","2"], ["2","2"]], [6, 0, 5, 8], 3));
        determinants.push(new SteppingStonePath(1, 3, [["0","2"], ["0","1"], ["1","1"], ["1","2"]], [4, 8, 0, 5], -9));
        determinants.push(new SteppingStonePath(1, 4, [["0","3"], ["2","3"], ["2","2"], ["1","2"], ["1","1"], ["0","1"]], [7, 1, 8, 5, 0, 8], 1));
        determinants.push(new SteppingStonePath(2, 4, [["1","3"], ["2","3"], ["2","2"], ["1","2"]], [7, 1, 8, 5], 9));
        let result = SteppingStoneHelper.findMinimum(determinants);
        expect(minimum).toEqual(result);  
    });

});


/**
 * Der dazugehörige Pfad der minimalsten Determinante soll richrig ermittelt werden
 * @author Franziska Friese 
 */
describe('Überprüfung des richtigen Pfades', function() {

    it("richtiger Pfad wird anhand der minimalen Determinante ermittelt", function() {
        let pathResult : Array<string[]> = [["0","2"], ["0","1"], ["1","1"], ["1","2"]];
        let minimum : number = -9;

        let determinants: Array<SteppingStonePath> = new Array<SteppingStonePath>();
        determinants.push(new SteppingStonePath(3, 1, [["2","0"], ["0","0"], ["0","1"], ["1","1"], ["1","2"], ["2","2"]], [3, 1, 8, 0, 5, 8], 7));
        determinants.push(new SteppingStonePath(2, 1, [["1","0"], ["0","0"], ["0","1"], ["1","1"]], [9, 1, 8, 0], 16));
        determinants.push(new SteppingStonePath(3, 2, [["2","1"], ["1","1"], ["1","2"], ["2","2"]], [6, 0, 5, 8], 3));
        determinants.push(new SteppingStonePath(1, 3, [["0","2"], ["0","1"], ["1","1"], ["1","2"]], [4, 8, 0, 5], -9));
        determinants.push(new SteppingStonePath(1, 4, [["0","3"], ["2","3"], ["2","2"], ["1","2"], ["1","1"], ["0","1"]], [7, 1, 8, 5, 0, 8], 1));
        determinants.push(new SteppingStonePath(2, 4, [["1","3"], ["2","3"], ["2","2"], ["1","2"]], [7, 1, 8, 5], 9));
        let result = SteppingStoneHelper.getPathOfMinimum(determinants, minimum);
        expect(pathResult).toEqual(result);  
    });

});

/**
 * Die Matrix soll nach jedem Iterationsschritt richrig gebildet werden
 * @author Franziska Friese
 */
describe('Überprüfung - richtige Bildung der neuen Matrix', function(){

    it("neue Matrix wurde richtig gebildet", function() {
        let newMatrix : number[][] = [[5, null, 15, null],
                                    [null, 25, 0, null],
                                    [5, null, null, 35]];
        let lengthOffer : number = 3;
        let lengthDemand : number = 4;
        let list : Array<SteppingStoneMapping>= [];
        
        list.push(new SteppingStoneMapping(0, 0, 5));
        list.push(new SteppingStoneMapping(0, 2, 15));
        list.push(new SteppingStoneMapping(1, 1, 25));
        list.push(new SteppingStoneMapping(1, 2, 0));
        list.push(new SteppingStoneMapping(2, 0, 5));
        list.push(new SteppingStoneMapping(2, 3, 35));
        
        let matrix = BPHelper.createMatrix(lengthOffer, lengthDemand);
        //@ts-ignore
        let result = SteppingStoneHelper.writeValuesInNewMatrix(matrix, list);

        expect(newMatrix).toEqual(result);
    });

});

/**
 * Die Mengen des Pfades soll richrig aus der Matrix geholt werden
 * @author Franziska Friese
 */
describe('richtige Werte aus Matrix holen', function() {

    it("Zwischenspeicher wurde mit richtigen Werten des Pfades befüllt", function() {
       let matrix : number[][] = [[10, 10, null, null], 
                                [null, 15, 10, null], 
                                [null, null, 5, 35]];
        let path : Array<string[]> = null;
        path = [["0","2"], ["0","1"], ["1","1"], ["1","2"]];

        let expected : Array<SteppingStoneMapping> = new Array<SteppingStoneMapping>();
        expected.push(new SteppingStoneMapping(0, 2, null));
        expected.push(new SteppingStoneMapping(0, 1, 10));
        expected.push(new SteppingStoneMapping(1, 1, 15));
        expected.push(new SteppingStoneMapping(1, 2, 10));
        //@ts-ignore
        let result : Array<SteppingStoneMapping> = SteppingStoneHelper.getValue(matrix, path);
        expect(expected).toEqual(result);
    });

});

/**
 * Überprüfung, ob eine Degeneration eingetreten ist
 * @author Franziska Friese
 */
describe('Überprüfung Degeneration', function() {

    it("Degeneration tritt ein", function() {

        let list: Array<SteppingStoneMapping> = [];
        list.push(new SteppingStoneMapping(2, 0, -10));
        list.push(new SteppingStoneMapping(1, 1, 20));
        list.push(new SteppingStoneMapping(0, 1, 0));
        list.push(new SteppingStoneMapping(1, 1, 25));
        list.push(new SteppingStoneMapping(1, 2, 0));

        //@ts-ignore
        let result = SteppingStoneHelper.checkDegeneracy(list);
        let check : boolean = result['check'];
        expect(() => {check}).toBeTruthy();
    });

    it("Degeneration tritt nicht ein", function() {

        let list: Array<SteppingStoneMapping> = [];
        list.push(new SteppingStoneMapping(2, 0, 5));
        list.push(new SteppingStoneMapping(0, 0, 5));
        list.push(new SteppingStoneMapping(0, 2, 15));
        list.push(new SteppingStoneMapping(2, 2, 0));
        //@ts-ignore
        let result = SteppingStoneHelper.checkDegeneracy(list);
        let check : boolean = result['check'];
        expect(false).toEqual(check);
    });

});


/**
 * Die Mengen sollen richrig verteilt werden
 * @author Franziska Friese
 */
describe('richtige Mengenverteilung', function() {

    it("Menge wurde richtig verteilt", function() {
        let matrix : number[][] = [[10, 10, null, null], 
                                    [null, 15, 10, null], 
                                    [null, null, 5, 35]];
        let path : Array<string[]> = [["0","2"], ["0","1"], ["1","1"], ["1","2"]];
        let lengthOffer : number = matrix.length;      
        let lengthDemand : number = matrix[0].length;
        let newMatrix : number[][]= [[10, 0, 10, null],
                                    [null, 25, null, null],
                                    [null, null, 5, 35]];

        let result = SteppingStoneHelper.distribution(matrix, path, lengthOffer, lengthDemand);
        expect(newMatrix).toEqual(result);             
    });
});

/**
 * Mengen mit dem Wert 0 sollen in null umgeschrieben werden; Ausnahme: Degeneration ist eingetreten
 * @author Franziska Friese
 */
describe('0 in null umschreiben - mit Degeneration', function() {

    it("Degeneration ist eingetreten und erste 0 wurde stehen gelassen, damit Regel n+m-1 nicht verletzt wurde", function() {
        let list : Array<SteppingStoneMapping> = [];
        let result : Array<SteppingStoneMapping> = [];
        let degeneracy : Array<SteppingStoneMapping>;

        list.push(new SteppingStoneMapping(0, 2, 10));
        list.push(new SteppingStoneMapping(0, 1, 0));
        list.push(new SteppingStoneMapping(1, 1, 25));
        list.push(new SteppingStoneMapping(1, 2, 0));
        
        result.push(new SteppingStoneMapping(0, 2, 10));
        result.push(new SteppingStoneMapping(0, 1, 0));
        result.push(new SteppingStoneMapping(1, 1, 25));
        result.push(new SteppingStoneMapping(1, 2, null));
        //@ts-ignore
        degeneracy = SteppingStoneHelper.change0ToNull(true, 2, list);
        expect(result).toEqual(degeneracy);
    });

    it("Degeneration ist NICHT eingetreten; Feld mit 0 wurde auf null gesetzt", function() {
        let list : Array<SteppingStoneMapping> = [];
        let result : Array<SteppingStoneMapping> = [];
        let degeneracy : Array<SteppingStoneMapping>;

        list.push(new SteppingStoneMapping(0, 0, 5));
        list.push(new SteppingStoneMapping(0, 2, 15));
        list.push(new SteppingStoneMapping(1, 1, 25));
        list.push(new SteppingStoneMapping(1, 2, 0));
        list.push(new SteppingStoneMapping(2, 0, 5));
        list.push(new SteppingStoneMapping(2, 3, 35));

        result.push(new SteppingStoneMapping(0, 0, 5));
        result.push(new SteppingStoneMapping(0, 2, 15));
        result.push(new SteppingStoneMapping(1, 1, 25));
        result.push(new SteppingStoneMapping(1, 2, null));
        result.push(new SteppingStoneMapping(2, 0, 5));
        result.push(new SteppingStoneMapping(2, 3, 35));
        //@ts-ignore
        degeneracy = SteppingStoneHelper.change0ToNull(false, 1, list);
        expect(result).toEqual(degeneracy);  
    });
});


/**
 * Die Regel "n + m - 1" soll fehlschlagen
 * @author Franziska Friese
 */
describe('Überprüfung der Regel n+m-1', function() {

    it("Regelverstoß: Es wurden bei einer 3x4-Matrix nur 5 Felder belegt", function() {
        let matrix : number[][] = [[10, 10, null, null], 
                                    [null, 15, null, null], 
                                    [null, null, 5, 35]];
        let lengthOffer : number = 3;
        let lengthDemand : number = 4;
        expect(() => {
            //@ts-ignore
            SteppingStoneHelper.checkRuleOfOccupiedFields(matrix, lengthOffer, lengthDemand);
        }).toThrowError("Die Matrix verstößt gegen die Regel n + m - 1!");

    });
});

/**
 * Wegefindung
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, ob Wegeermittlung korrekt ist', () => {

    let matrix = [[10, 10, null, null],
    [null, 15, 10, null],
    [null, null, 5, 35]];

    let costMatrix = [[1, 8, 4, 7],
    [9, 0, 5, 7],
    [3, 6, 8, 1]];


    it('Wegefindung korrekt', () => {

        let lengthOffer = 3;
        let lengthDemand = 4;

        let allCostDifferences: Array<string> = new Array<string>();
        allCostDifferences.push('D13 = c13 - c12 + c22 - c23 = 4 - 8 + 0 - 5 = -9');
        allCostDifferences.push('D14 = c14 - c12 + c22 - c23 + c33 - c34 = 7 - 8 + 0 - 5 + 8 - 1 = 1');
        allCostDifferences.push('D21 = c21 - c22 + c12 - c11 = 9 - 0 + 8 - 1 = 16');
        allCostDifferences.push('D24 = c24 - c23 + c33 - c34 = 7 - 5 + 8 - 1 = 9');
        allCostDifferences.push('D31 = c31 - c33 + c23 - c22 + c12 - c11 = 3 - 8 + 5 - 0 + 8 - 1 = 7');
        allCostDifferences.push('D32 = c32 - c33 + c23 - c22 = 6 - 8 + 5 - 0 = 3');

        let allPathDetails: Array<SteppingStonePath> = new Array<SteppingStonePath>();
        allPathDetails.push(new SteppingStonePath(0, 2, [["0", "2"], ["0", "1"], ["1", "1"], ["1", "2"]], [4, 8, 0, 5], -9));
        allPathDetails.push(new SteppingStonePath(0, 3, [["0", "3"], ["0", "1"], ["1", "1"], ["1", "2"], ["2", "2"], ["2", "3"]], [7, 8, 0, 5, 8, 1], 1));
        allPathDetails.push(new SteppingStonePath(1, 0, [["1", "0"], ["1", "1"], ["0", "1"], ["0", "0"]], [9, 0, 8, 1], 16));
        allPathDetails.push(new SteppingStonePath(1, 3, [["1", "3"], ["1", "2"], ["2", "2"], ["2", "3"]], [7, 5, 8, 1], 9));
        allPathDetails.push(new SteppingStonePath(2, 0, [["2", "0"], ["2", "2"], ["1", "2"], ["1", "1"], ["0", "1"], ["0", "0"]], [3, 8, 5, 0, 8, 1], 7));
        allPathDetails.push(new SteppingStonePath(2, 1, [["2", "1"], ["2", "2"], ["1", "2"], ["1", "1"]], [6, 8, 5, 0], 3));

        let result = SteppingStoneHelper.getPathsAndCostDifferences(matrix, costMatrix, lengthOffer, lengthDemand);
        expect(result['allCostDifferences']).toEqual(allCostDifferences);
        expect(result['allPathDetails']).toEqual(allPathDetails);

    });
});

/**
 * Prüfen, ob richtiger Pfad gefunden wird
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, ob richtiger Pfad gefunden wird', () => {

    it('Finaler Pfad', () => {

        let matrix = [[10, 10, null, null],
        [null, 15, 10, null],
        [null, null, 5, 35]];
        let startPositionOffer = 1;
        let startPositionDemand = 3;
        let lengthOffer = 3;
        let lengthDemand = 4;
        let expectedFinalPath: Array<string[]> = [['1', '3'], ['1', '2'], ['2', '2'], ['2', '3']];
        //@ts-ignore
        let result = SteppingStoneHelper.findPath(matrix, startPositionOffer, startPositionDemand, lengthOffer, lengthDemand);
        expect(result).toEqual(expectedFinalPath);
    });

});

/**
 * Prüfen, des nächsten Nachbarn
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, ob nächster Nachbar korrekt', () => {

    let matrix = [[10, 10, null, null],
    [null, 15, 10, null],
    [null, null, 5, 35]];

    it('Nächster horizontaler Nachbar', () => {

        let direction = 'HORIZONTAL';
        let distance = 1;
        let lastHorizontalDirection = '';
        let lastVerticalDirection = '';
        let nextHorizontalDirection = '';
        let nextVerticalDirection = '';
        let offer = 2;
        let demand = 1;
        let startOffer = 2;
        let startDemand = 1;
        let lengthOffer = 3;
        let lengthDemand = 4;

        //@ts-ignore
        let result = SteppingStoneHelper.findNextNeighbour(direction, distance, lastHorizontalDirection, lastVerticalDirection, nextHorizontalDirection, nextVerticalDirection, matrix, offer, demand, startOffer, startDemand, lengthOffer, lengthDemand);
        expect(result['possiblePosOffer']).toEqual(2);
        expect(result['possiblePosDemand']).toEqual(2);
    });

    it('Nächster vertikal Nachbar', () => {

        let direction = 'VERTICAL';
        let distance = 1;
        let lastHorizontalDirection = '';
        let lastVerticalDirection = '';
        let nextHorizontalDirection = '';
        let nextVerticalDirection = '';
        let offer = 0;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 3;
        let lengthOffer = 3;
        let lengthDemand = 4;

        //@ts-ignore
        let result = SteppingStoneHelper.findNextNeighbour(direction, distance, lastHorizontalDirection, lastVerticalDirection, nextHorizontalDirection, nextVerticalDirection, matrix, offer, demand, startOffer, startDemand, lengthOffer, lengthDemand);
        expect(result['possiblePosOffer']).toEqual(1);
        expect(result['possiblePosDemand']).toEqual(1);
    });

    it('Keine Richtung angegeben', () => {

        let direction = '';
        let distance = 1;
        let lastHorizontalDirection = '';
        let lastVerticalDirection = '';
        let nextHorizontalDirection = '';
        let nextVerticalDirection = '';
        let offer = 0;
        let demand = 1;
        let startOffer = 0
        let startDemand = 3
        let lengthOffer = 3;
        let lengthDemand = 4;

        expect(() => {
            //@ts-ignore
            SteppingStoneHelper.findNextNeighbour(direction, distance, lastHorizontalDirection, lastVerticalDirection, nextHorizontalDirection, nextVerticalDirection, matrix, offer, demand, startOffer, startDemand, lengthOffer, lengthDemand);
        }).toThrowError("Keine Richtung angegeben, um nach Nachbarn zu suchen!");

    });


});

/**
 * Prüfen, ob es ein belegtes Feld rechts vom Ausgangspunkt gibt
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, auf Nachbarn rechts', () => {

    let matrix = [[10, 10, null, null],
    [null, 15, 10, null],
    [null, null, 5, 35]];

    it('Normaler Nachbar existiert:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 1;
        let offer = 1;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 2;
        let lengthDemand = 4;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourRight(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand, lengthDemand);
        expect(result['hasNeighbour']).toEqual(true);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosDemand']).toEqual(2);
        expect(result['lastHorizontalDirection']).toEqual('RIGHT');
    });

    it('Nachbar existiert nicht:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 2;
        let offer = 1;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 2;
        let lengthDemand = 4;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourRight(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand, lengthDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosDemand']).toEqual(0);
        expect(result['lastHorizontalDirection']).toEqual('');
    });

    it('Nachbar existiert nicht - Distanz ausgereizt:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 3;
        let offer = 1;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 2;
        let lengthDemand = 4;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourRight(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand, lengthDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(true);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosDemand']).toEqual(0);
        expect(result['lastHorizontalDirection']).toEqual('');
    });

    it('Finaler Pfad gefunden:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 1;
        let offer = 0;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 2;
        let lengthDemand = 4;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourRight(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand, lengthDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(true);
        expect(result['possiblePosDemand']).toEqual(2);
        expect(result['lastHorizontalDirection']).toEqual('');
    });

});

/**
 * Prüfen, ob es ein belegtes Feld links vom Ausgangspunkt gibt
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, auf Nachbarn links', () => {

    let matrix = [[10, 10, null, null],
    [null, 15, 10, null],
    [null, null, 5, 35]];

    it('Normaler Nachbar existiert:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 1;
        let offer = 1;
        let demand = 2;
        let startOffer = 0;
        let startDemand = 2;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLeft(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(true);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosDemand']).toEqual(1);
        expect(result['lastHorizontalDirection']).toEqual('LEFT');
    });

    it('Nachbar existiert nicht:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 2;
        let offer = 1;
        let demand = 2;
        let startOffer = 0;
        let startDemand = 2;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLeft(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosDemand']).toEqual(0);
        expect(result['lastHorizontalDirection']).toEqual('');
    });

    it('Nachbar existiert nicht - Distanz ausgereizt:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 3;
        let offer = 1;
        let demand = 2;
        let startOffer = 0;
        let startDemand = 2;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLeft(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(true);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosDemand']).toEqual(0);
        expect(result['lastHorizontalDirection']).toEqual('');
    });

    it('Finaler Pfad gefunden:', () => {
        let possiblePosDemand = 0;
        let lastHorizontalDirection = '';
        let distance = 1;
        let offer = 2;
        let demand = 2;
        let startOffer = 2;
        let startDemand = 1;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLeft(matrix, possiblePosDemand, lastHorizontalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(true);
        expect(result['possiblePosDemand']).toEqual(1);
        expect(result['lastHorizontalDirection']).toEqual('');
    });
});

/**
 * Prüfen, ob es ein belegtes Feld oberhalb von Ausgangspunkt gibt
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, auf Nachbarn oberhalb', () => {

    let matrix = [[10, 10, null, null],
    [null, 15, 10, null],
    [null, null, 5, 35]];

    it('Normaler Nachbar exisitert:', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 1;
        let offer = 2;
        let demand = 2;
        let startOffer = 2;
        let startDemand = 1;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourUpper(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(true);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosOffer']).toEqual(1);
        expect(result['lastVerticalDirection']).toEqual('UPPER');
    });

    it('Nachbar exisitert nicht:', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 2;
        let offer = 2;
        let demand = 2;
        let startOffer = 2;
        let startDemand = 1;
        let lengthOffer = 3;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourUpper(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosOffer']).toEqual(0);
        expect(result['lastVerticalDirection']).toEqual('');
    });

    it('Nachbar exisitert nicht - Distanz ausgereizt:', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 3;
        let offer = 2;
        let demand = 2;
        let startOffer = 2;
        let startDemand = 1;
        let lengthOffer = 3;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourUpper(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(true);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosOffer']).toEqual(0);
        expect(result['lastVerticalDirection']).toEqual('');
    });

    it('Finalen Pfad gefunden:', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 1;
        let offer = 1;
        let demand = 2;
        let startOffer = 0;
        let startDemand = 2;
        let lengthOffer = 3;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourUpper(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(true);
        expect(result['possiblePosOffer']).toEqual(0);
        expect(result['lastVerticalDirection']).toEqual('');
    });

});

/**
 * Prüfen, ob es ein belegtes Feld unterhalb von Ausgangspunkt gibt
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, auf Nachbarn unterhalb ', () => {

    let matrix = [[10, 10, null, null],
    [null, 15, 10, null],
    [null, null, 5, 35]];

    it('Normaler Nachbar exisitert: ', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 1;
        let offer = 0;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 2;
        let lengthOffer = 3;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLower(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand, lengthOffer);
        expect(result['hasNeighbour']).toEqual(true);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosOffer']).toEqual(1);
        expect(result['lastVerticalDirection']).toEqual('LOWER');
    });

    it('Nachbar exisitert nicht: ', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 2;
        let offer = 0;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 2;
        let lengthOffer = 3;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLower(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand, lengthOffer);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosOffer']).toEqual(0);
        expect(result['lastVerticalDirection']).toEqual('');
    });

    it('Nachbar exisitert nicht - Distanz ausgereizt: ', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 3;
        let offer = 0;
        let demand = 1;
        let startOffer = 0;
        let startDemand = 2;
        let lengthOffer = 3;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLower(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand, lengthOffer);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(true);
        expect(result['foundFinalPath']).toEqual(false);
        expect(result['possiblePosOffer']).toEqual(0);
        expect(result['lastVerticalDirection']).toEqual('');
    });

    it('Finalen Pfad gefunden: ', () => {
        let possiblePosOffer = 0;
        let lastVerticalDirection = '';
        let distance = 1;
        let offer = 1;
        let demand = 1;
        let startOffer = 2;
        let startDemand = 1;
        let lengthOffer = 3;

        //@ts-ignore
        let result = SteppingStoneHelper.findNeighbourLower(matrix, possiblePosOffer, lastVerticalDirection, distance, offer, demand, startOffer, startDemand, lengthOffer);
        expect(result['hasNeighbour']).toEqual(false);
        expect(result['distanceExhausted']).toEqual(false);
        expect(result['foundFinalPath']).toEqual(true);
        expect(result['possiblePosOffer']).toEqual(2);
        expect(result['lastVerticalDirection']).toEqual('');
    });

});

/**
 * Prüfen, ob Feld geeignet oder ungeeignet ist für Pfad
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, ob Feld geeignet ist für Pfad', () => {

    it('Feld ist geeignet - Liste leer', () => {
        let listUnsuitableFields = [];
        let positionOffer = 1;
        let positionDemand = 3;
        //@ts-ignore
        let result = SteppingStoneHelper.isFieldUnsuitable(listUnsuitableFields, positionOffer, positionDemand);
        expect(result).toEqual(false);
    });

    it('Feld ist geeignet - Liste gefüllt', () => {
        let listUnsuitableFields = [['3', '2']];
        let positionOffer = 1;
        let positionDemand = 3;
        //@ts-ignore
        let result = SteppingStoneHelper.isFieldUnsuitable(listUnsuitableFields, positionOffer, positionDemand);
        expect(result).toEqual(false);
    });

    it('Feld ist ungeeignet - Liste gefüllt', () => {
        let listUnsuitableFields = [['3', '2']];
        let positionOffer = 3;
        let positionDemand = 2;
        //@ts-ignore
        let result = SteppingStoneHelper.isFieldUnsuitable(listUnsuitableFields, positionOffer, positionDemand);
        expect(result).toEqual(true);
    });

});

/**
 * Prüfen, ob  das ermittelte Feld schonmal passiert worden ist
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, ob Feld schon in Pfad enthalten', () => {

    it('Feld noch nicht im Pfad', () => {
        let finalPath = [['1', '3'], ['2', '3'], ['2', '2']];
        let positionOffer = 1;
        let positionDemand = 2;
        //@ts-ignore
        let result = SteppingStoneHelper.isFieldAlreadyInPath(finalPath, positionOffer, positionDemand);
        expect(result).toEqual(false);
    });

    it('Feld schon in Pfad enthalten', () => {
        let finalPath = [['1', '3'], ['2', '3'], ['2', '2'], ['1', '2']];
        let positionOffer = 1;
        let positionDemand = 2;
        //@ts-ignore
        let result = SteppingStoneHelper.isFieldAlreadyInPath(finalPath, positionOffer, positionDemand);
        expect(result).toEqual(true);
    });

});

/**
 * Prüfen, ob alle Anforderungen für finalen Pfad erfüllt sind
 * @author Franziska Dittmeyer
 */
describe('Überprüfungen der Anforderungen des finalen Pfad', () => {

    it('Alle Anforderungen erfüllt', () => {
        let path = [['1', '3'], ['2', '3'], ['2', '2'], ['1', '2']];
        let startOffer = 1;
        let startDemand = 3;
        //@ts-ignore
        let result = SteppingStoneHelper.checkIfFinalPath(path, startOffer, startDemand);
        expect(result).toEqual(true);
    });

    it('Weniger als 4 Einträge', () => {
        let path = [['1', '3'], ['2', '3']];
        let startOffer = 1;
        let startDemand = 3;
        //@ts-ignore
        let result = SteppingStoneHelper.checkIfFinalPath(path, startOffer, startDemand);
        expect(result).toEqual(false);
    });

    it('Ungerade Anzahl an Feldern', () => {
        let path = [['1', '3'], ['2', '3'], ['2', '2'], ['1', '2'], ['1', '1']];
        let startOffer = 1;
        let startDemand = 3;
        //@ts-ignore
        let result = SteppingStoneHelper.checkIfFinalPath(path, startOffer, startDemand);
        expect(result).toEqual(false);
    });

    it('Startfeld vom Pfad entspricht Start-Koordinaten ', () => {
        let path = [['1', '3'], ['2', '3'], ['2', '2'], ['1', '2']];
        let startOffer = 2;
        let startDemand = 3;
        //@ts-ignore
        let result = SteppingStoneHelper.checkIfFinalPath(path, startOffer, startDemand);
        expect(result).toEqual(false);
    });

});


/**
 * Prüfen, ob Kosten je Feld aus Kostenmatrix richtig bestimmt wurden und in Array abgespeichert sind
 * @author Franziska Dittmeyer
 */
describe('Überprüfen, ob Kosten je Feld aus Kostenmatrix richtig bestimmt und abgespeichert werden', () => {

    it('Kürzerer Pfad gegeben: ', () => {

        let path = [['1', '3'], ['2', '3'], ['2', '2'], ['1', '2']];
        let costMatrix = [[1, 8, 4, 7],
        [9, 0, 5, 7],
        [3, 6, 8, 1]];
        let expectedCostsArray = [7, 1, 8, 5];

        //@ts-ignore
        let result = SteppingStoneHelper.determineCostPath(path, costMatrix);
        expect(result).toEqual(expectedCostsArray);

    });

    it('Längerer Pfad gegeben: ', () => {

        let path = [['2', '0'], ['0', '0'], ['0', '1'], ['1', '1'], ['1', '2'], ['2', '2']];
        let costMatrix = [[1, 8, 4, 7],
        [9, 0, 5, 7],
        [3, 6, 8, 1]];
        let expectedCostsArray = [3, 1, 8, 0, 5, 8];

        //@ts-ignore
        let result = SteppingStoneHelper.determineCostPath(path, costMatrix);
        expect(result).toEqual(expectedCostsArray);

    });

});

/**
 * Prüfen, ob Gesamtkosten richtig berechnet werden
 * @author Franziska Dittmeyer
 */
describe('Überprüfen der Gesamtkosten-Berechnung', () => {

    it('Gesamtkosten sind positiv', () => {

        let costsPerField = [9, 1, 8, 0];
        let expectedTotalCosts = 16;

        //@ts-ignore
        let result = SteppingStoneHelper.calculateTotalCosts(costsPerField);
        expect(result).toEqual(expectedTotalCosts);

    });

    it('Gesamtkosten sind negativ', () => {

        let costsPerField = [4, 8, 0, 5];
        let expectedTotalCosts = -9;

        //@ts-ignore
        let result = SteppingStoneHelper.calculateTotalCosts(costsPerField);
        expect(result).toEqual(expectedTotalCosts);

    });

    it('Gesamtkosten sind negativ', () => {

        let costsPerField = [12, 10, 8, 10];
        let expectedTotalCosts = 0;

        //@ts-ignore
        let result = SteppingStoneHelper.calculateTotalCosts(costsPerField);
        expect(result).toEqual(expectedTotalCosts);

    });

});

