import { BaseStep } from './BaseStep';
import { BPHelper } from './baseProcedureHelper';

export class MatrixMinimum {
  /**
   * Solver für das Matrix-Minimum-Verfahren
   * @author Paul Väthjunker und Marius Benkert
   * @param {Array} costMatrix - Einheitskostenmatrix
   * @param {Array} offerArray - Angebots Array
   * @param {Array} demandArray - Bedarfs Array
   * @returns {Array} Steps Array
   */
  public static solve(costMatrix: number[][], offerArray: number[], demandArray: number[]): BaseStep[] {
    const steps: BaseStep[] = [];

    const lengthOffer = offerArray.length;
    const lengthDemand = demandArray.length;

    const result = BPHelper.createMatrix(lengthOffer, lengthDemand);

    BPHelper.safeStep(steps, result, offerArray, demandArray);

    let minimum = this.findMinimum(costMatrix, offerArray, demandArray, lengthOffer, lengthDemand);
    let help = 0;

    // Solange es weiter Minima in der Einheitskostenmatrix gibt
    while (minimum != null) {
      const x = minimum[0];
      const y = minimum[1];

      // Fülle Minimum Feld
      BPHelper.updateResources(x, y, offerArray, demandArray, result);
      switch (true) {
        case offerArray[x] === demandArray[y]:
          BPHelper.updateCostMatrix(costMatrix, x, y);
          break;

        case offerArray[x] < demandArray[y]:
          BPHelper.updateCostMatrix(costMatrix, x, undefined);
          break;

        case offerArray[x] > demandArray[y]:
          BPHelper.updateCostMatrix(costMatrix, undefined, y);
          break;
      }

      // Suche nächstes Minimum
      minimum = this.findMinimum(costMatrix, offerArray, demandArray, lengthOffer, lengthDemand);
      help++;

      if (help === 100) {
        break;
      }

      // Speichere Kostenmatrix, Angebots Array und Bedarfs Array nach jedem Durchlauf
      BPHelper.safeStep(steps, result, offerArray, demandArray);
    }

    return steps;
  }

  /**
   * Finde das Minimum der Einheitskostenmatrix welches in betracht auf Angebots und Betrags Array am optimalsten ist
   * @author Paul Väthjunker
   * @param {Array} costMatrix - Einheitskostenmatrix
   * @param {Array} offerArray - Angebots Array
   * @param {Array} demandArray - Bedarfs Array
   * @returns {Array} X und Y Index des optimalsten Feldes der Einheitskostenmatrix
   */
  private static findMinimum(costMatrix: number[][], offerArray: number[], demandArray: number[], lenX: number, lenY: number) {
    const min = [];
    let temp = Infinity;

    for (let x = 0; x < lenX; x++) {
      for (let y = 0; y < lenY; y++) {
        if (!(costMatrix[x][y] == null) && costMatrix[x][y] < temp) {
          temp = costMatrix[x][y];
        }
      }
    }

    for (let x = 0; x < lenX; x++) {
      for (let y = 0; y < lenY; y++) {
        if (costMatrix[x][y] === temp) {
          min.push([x, y]);
        }
      }
    }

    if (min === undefined || min.length === 0) {
      return null;
    }

    return BPHelper.bestFittingMinimum(min, offerArray, demandArray);
  }
}
