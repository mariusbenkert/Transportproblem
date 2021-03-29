import { BaseStep } from './BaseStep';

export class BPHelper {
  /**
   * Erstellung einer mit null gefüllten Matrix
   * @author Paul Väthjunker
   * @param {Number} x - Spalten
   * @param {Number} y - Zeilen
   * @returns {Array} Leere Matrix mit den Dimensionen x,y
   */
  public static createMatrix(x: number, y: number): number[][] {
    if (x <= 0 || y <= 0) {
      throw RangeError('Cannot create Matrix <= 0');
    }

    const arr = new Array(x);

    for (let i = 0; i < x; i++) {
      arr[i] = new Array(y);
      for (let z = 0; z < y; z++) {
        arr[i][z] = null;
      }
    }

    return arr;
  }

  /**
   * Streiche eine Zeile und/oder eine Spalte der Kostenmatrix
   * @author Marius Benkert und Paul Väthjunker
   * @param {Array} costMatrix - Kostenmatrix
   * @param {Number} x - Index der zu streichenden Spalte
   * @param {Number} y - Index der zu streichenden Zeile
   */
  public static updateCostMatrix(costMatrix: number[][], x?: number, y?: number) {
    if (x > costMatrix.length || y > costMatrix[0].length || x < 0 || y < 0) {
      throw RangeError('x and y cannot lay outside costMatrix');
    }

    if (x != null && y != null) {
      this.updateCostMatrix(costMatrix, undefined, y);
      this.updateCostMatrix(costMatrix, x, undefined);
    }

    let length = 0;

    if (x == null) {
      length = costMatrix.length;
    }

    if (y == null) {
      length = costMatrix[0].length;
    }

    for (let i = 0; i < length; i++) {
      if (y != null) {
        costMatrix[i][y] = null;
      }

      if (x != null) {
        costMatrix[x][i] = null;
      }
    }
  }

  /**
   * Aufteilen der Angebots und Bedarfsmengen auf vorgegebenes Feld der Ergebnismatrix
   * @author Marius Benkert und Paul Väthjunker
   * @param {Number} x - Spaltenindex
   * @param {Number} y - Zeilenindex
   * @param {Number} offerArray - Angebots Array
   * @param {Number} demandArray - Bedarfs Array
   * @param {Number} resultMatrix - Ergebnismatrix
   */
  public static updateResources(x: number,y: number, offerArray: number[], demandArray: number[], resultMatrix: number[][]) {
    if (x > resultMatrix.length || y > resultMatrix[0].length || x < 0 || y < 0) {
      throw RangeError('x and y cannot lay outside costMatrix');
    }

    const min = Math.min(offerArray[x], demandArray[y]);
    offerArray[x] -= min;
    demandArray[y] -= min;
    resultMatrix[x][y] = min;
  }

  /**
   * Finde aus einem Array mit Feldern eines ,welches in betracht auf Angebots und Bedarfs Array das optimalste ist
   * @author Paul Väthjunker
   * @param {Array} minima - Array der zur Auswahl stehenden Felder
   * @param {Array} offerArray - Angebots Array
   * @param {Array} demandArray - Bedarfs Array
   * @returns {Array} X und Y Koordinate des besten Feldes
   */
  public static bestFittingMinimum(minima: number[][], offerArray: number[], demandArray: number[]) {
    let actualBest = minima[0];
    let value = Math.min(offerArray[minima[0][0]], demandArray[minima[0][1]]);

    minima.forEach((minimum) => {
      const temp = Math.min(offerArray[minimum[0]], demandArray[minimum[1]]);

      if (Math.max(offerArray[minimum[0]], demandArray[minimum[1]]) - temp === 0) {
        return minimum;
      } else if (temp > value) {
        actualBest = minimum;
        value = temp;
      }
    });

    return actualBest;
  }

  /**
   * Speichert den aktuellen schritt des Algorithmus in das übergebene Steps Array
   * @author Marius Benkert
   * @param {BaseStep} steps - Steps Array
   * @param {Array} resultMatrix - Ergebnismatrix
   * @param {Array} offerArray - Angebots Array
   * @param {Array} demandArray - Bedarfs Array
   */
  // speichere jeden Schritt des Algorithmus
  public static safeStep(steps: BaseStep[], resultMatrix: number[][], offerArray: number[], demandArray: number[]) {
    const step: BaseStep = { resultMatrix, offerArray, demandArray };

    steps.push(JSON.parse(JSON.stringify(step)));
  }
}
