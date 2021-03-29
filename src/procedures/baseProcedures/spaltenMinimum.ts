import { BaseStep } from './BaseStep';
import { BPHelper } from './baseProcedureHelper';

/**
 * Solver für das Spalten-Minimum-Verfahren
 * @author Marius Benkert
 * @param {Array} costMatrix - Einheitskostenmatrix
 * @param {Array} offerArray - Angebots Array
 * @param {Array} demandArray - Bedarfs Array
 * @returns {Array} Steps Array
 */
export class SpaltenMinimum {
  public static solve(costMatrix: number[][], offerArray: number[], demandArray: number[]): BaseStep[] {
    const steps: BaseStep[] = [];
    const resultMatrix = BPHelper.createMatrix(offerArray.length, demandArray.length);

    BPHelper.safeStep(steps, resultMatrix, offerArray, demandArray);

    // gehe jede Spalte einmal ab
    for (let column = 0; column < demandArray.length; column++) {
      let demand = demandArray[column];

      // loop solange, bis Nachfrage von Spalte gedeckt ist
      while (demand > 0) {
        const minIndex = this.findMinimum(costMatrix, column, offerArray, demandArray);
        const x = minIndex[0];
        const y = minIndex[1];

        let offer = offerArray[x];

        // wie viel Nachfrage kann ich decken?
        const min = Math.min(demand, offer);
        demand = demand - min;
        offer = offer - min;

        // update die Original Arrays
        BPHelper.updateResources(x, y, offerArray, demandArray, resultMatrix);

        // falls Angebot aufgebraucht, streiche es
        if (offer === 0) {
          BPHelper.updateCostMatrix(costMatrix, x, undefined);
        }

        BPHelper.safeStep(steps, resultMatrix, offerArray, demandArray);
      }
    }
    return steps;
  }

  // returns the index of min-cost of specified column
  /**
   * Finde das Minimum einer Spalte der Einheitskostenmatrix welches in betracht auf Angebots und Betrags Array am optimalsten ist
   * @author Marius Benkert
   * @param {Array} costMatrix - Einheitskostenmatrix
   * @param {Array} columnCounter - Spalten Index
   * @param {Array} offerArray - Angebots Array
   * @param {Array} demandArray - Bedarfs Array
   * @returns {Array} X und Y Index des optimalsten Feldes der Einheitskostenmatrix in gegebener Spalte
   */
  private static findMinimum(costMatrix: number[][], columnCounter: number, offerArray: number[], demandArray: number[]): number[] {
    let index: number[] = [];
    let minimum = Infinity;
    let allMinima: number[][] = [];

    for (let i = 0; i < costMatrix.length; i++) {
      if (costMatrix[i][columnCounter] === minimum) {
        allMinima.push([i, columnCounter]);
      }
      if (costMatrix[i][columnCounter] < minimum && costMatrix[i][columnCounter] != null) {
        minimum = costMatrix[i][columnCounter];
        const tempIndex = [];
        tempIndex.push(i, columnCounter);
        index = tempIndex;
        allMinima = [];
        allMinima.push([i, columnCounter]);
      }
    }

    return BPHelper.bestFittingMinimum(allMinima, offerArray, demandArray);
  }
}
