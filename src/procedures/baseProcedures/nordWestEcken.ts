import { BPHelper } from './baseProcedureHelper';
import { BaseStep } from './BaseStep';

/**
 * Solver für die Nord-West-Ecken Regel
 * @author Paul Väthjunker und Marius Benkert
 * @param {Array} offerArray - Angebots Array
 * @param {Array} demandArray - Bedarfs Array
 * @returns {Array} Steps Array
 */
export class NordWestEcken {
  public static solve(offerArray: number[], demandArray: number[]): BaseStep[] {
    const steps: BaseStep[] = [];

    const lengthOffer = offerArray.length;
    const lengthDemand = demandArray.length;
    const result = BPHelper.createMatrix(lengthOffer, lengthDemand);

    BPHelper.safeStep(steps, result, offerArray, demandArray);

    // Starte im oberen linken Feld der Einheitskostenmatrix
    for (let b = 0; b < lengthDemand; ) {
      for (let a = 0; a < lengthOffer; ) {
        if (offerArray[a] > demandArray[b]) {
          // Fülle aktuelles Feld und gehe ein Feld nach rechts
          result[a][b] = demandArray[b];
          offerArray[a] = offerArray[a] - demandArray[b];
          demandArray[b] = 0;
          b++;

        } else if (offerArray[a] < demandArray[b]) {
          // Fülle aktuelles Feld und gehe ein Feld nach unten
          result[a][b] = offerArray[a];
          demandArray[b] = demandArray[b] - offerArray[a];
          offerArray[a] = 0;
          a++;

        } else if (offerArray[a] === demandArray[b]) {
          // Fülle aktuelles Feld und gehe ein Feld nach unten und nach rechts
          result[a][b] = offerArray[a];
          demandArray[b] = 0;
          offerArray[a] = 0;
          b++;
          a++;
          
        } else {
          b++;
          a++;
        }

        BPHelper.safeStep(steps, result, offerArray, demandArray);
      }
    }
    return steps;
  }
}
