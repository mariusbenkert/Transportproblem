import { SteppingStoneHelper } from "./steppingStoneHelper";
import { SteppingStoneStep } from "./steppingStoneStep"

export class SteppingStoneBase {

    /**
     * Stepping-Stone-Methode: Optimierung der Ausgangslösungen
     * @author Franziska Dittmeyer und Franziska Friese
     * @param {number[][]} baseMatrix - Mengenmatrix
     * @param {number[][]} costMatrix - Einheitskostenmatrix
     * @param {number[]} offerArray - Angebots Array
     * @param {number[]} demandArray - Bedarfs Array
     * @param {number} lengthDemand - Anzahl Bedarfsorte
     * @param {number} lengthOffer - Anzahl Angebotsorte
     * @returns {SteppingStoneStep[]} - Array mit einzelnen Iterationsschritten
     */
    public solve(baseMatrix: number[][], costMatrix: number[][], offerArray: number[], demandArray: number[], lengthDemand: number, lengthOffer: number) : SteppingStoneStep[] {

        let steps: SteppingStoneStep[] = [];
        let allPathsAndDeterminants;
        let changedMatrix: number[][] = baseMatrix;
        let minimumValue: number = 0;
        let totalCosts: number = 0;
        let path: Array<string[]> = null;
        
        //Überprüfung der Ausgangsmatrix auf die Regel n+m-1
        SteppingStoneHelper.checkRuleOfOccupiedFields(baseMatrix, lengthOffer, lengthDemand);

        do {
            // Wegefindung der nicht belegten Felder in der Matrix & Ermittlung der zugehörigen Kostendifferenzen
            allPathsAndDeterminants = SteppingStoneHelper.getPathsAndCostDifferences(changedMatrix, costMatrix, lengthOffer, lengthDemand);
            let allPathDetails = allPathsAndDeterminants["allPathDetails"];
            let allCostDifferencesToShow = allPathsAndDeterminants["allCostDifferences"];

            //Minimum der Kostendifferenzen finden
            minimumValue = SteppingStoneHelper.findMinimum(allPathDetails);

            if (minimumValue < 0) {
                path = SteppingStoneHelper.getPathOfMinimum(allPathDetails, minimumValue);

                //Verteilen der Mengen
                changedMatrix = SteppingStoneHelper.distribution(changedMatrix, path, lengthOffer, lengthDemand);

                //geänderte Matrix auf Nebenbedingungen überprüfen
                SteppingStoneHelper.checkAllConstraints(changedMatrix, offerArray, demandArray, lengthOffer, lengthDemand);

                //Ermittlung der Gesamtkosten
                totalCosts = SteppingStoneHelper.calculateTotalCostsOfMatrix(changedMatrix, costMatrix, lengthOffer, lengthDemand);

                SteppingStoneHelper.safeStep(steps, changedMatrix, offerArray, demandArray, totalCosts, allCostDifferencesToShow);

            } else {

                // Ermittlung der Gesamtkosten
                totalCosts = SteppingStoneHelper.calculateTotalCostsOfMatrix(changedMatrix, costMatrix, lengthOffer, lengthDemand);

                SteppingStoneHelper.safeStep(steps, changedMatrix, offerArray, demandArray, totalCosts, allCostDifferencesToShow);

            }

        } while (minimumValue < 0);

        return steps;
    }

}