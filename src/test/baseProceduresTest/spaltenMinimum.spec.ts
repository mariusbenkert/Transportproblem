import { SpaltenMinimum } from '@procedures/baseProcedures/spaltenMinimum';

/**
 * Testen, ob SpaltenMinimum-Verfahren richtiges Ergebnis-Array ausgibt
 * @author Marius Benkert
 */
describe('SpaltenMinimum', () => {

  let offerArray: number[];
  let demandArray: number[];
  let costMatrix: number[][];

  beforeEach(() => {
    costMatrix = [
      [7, 7, 4, 7],
      [9, 5, 3, 3],
      [7, 7, 6, 4]
    ];

    demandArray = [6, 5, 8, 6];
    offerArray = [10, 8, 7];
  });

  it('Normalfall, einfache Parameter. Solver', () => {
    const path = SpaltenMinimum.solve(costMatrix, offerArray, demandArray);
    const resultMatrix = path[path.length - 1].resultMatrix;
    expect(resultMatrix).toEqual(
      [[6, null, 4, null],
      [null, 5, 3, null],
      [null, null, 1, 6]]);
  });

  it('Pfad des Solvers ausgeben', () => {
    const path = SpaltenMinimum.solve(costMatrix, offerArray, demandArray);

    expect(path).toEqual([
      {
        resultMatrix: [
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null]
        ],
        offerArray: [10, 8, 7],
        demandArray: [6, 5, 8, 6]
      },
      {
        resultMatrix: [
          [6, null, null, null],
          [null, null, null, null],
          [null, null, null, null]
        ],
        offerArray: [4, 8, 7],
        demandArray: [0, 5, 8, 6]
      },
      {
        resultMatrix: [
          [6, null, null, null],
          [null, 5, null, null],
          [null, null, null, null]
        ],
        offerArray: [4, 3, 7],
        demandArray: [0, 0, 8, 6]
      },
      {
        resultMatrix: [
          [6, null, null, null],
          [null, 5, 3, null],
          [null, null, null, null]
        ],
        offerArray: [4, 0, 7],
        demandArray: [0, 0, 5, 6]
      },
      {
        resultMatrix: [
          [6, null, 4, null],
          [null, 5, 3, null],
          [null, null, null, null]
        ],
        offerArray: [0, 0, 7],
        demandArray: [0, 0, 1, 6]
      },
      {
        resultMatrix: [
          [6, null, 4, null],
          [null, 5, 3, null],
          [null, null, 1, null]
        ],
        offerArray: [0, 0, 6],
        demandArray: [0, 0, 0, 6]
      },
      {
        resultMatrix: [
          [6, null, 4, null],
          [null, 5, 3, null],
          [null, null, 1, 6]
        ],
        offerArray: [0, 0, 0],
        demandArray: [0, 0, 0, 0]
      }
    ]);
  });

  /**
   * Testen, ob das richtige Minimum ausgegeben wird
   * @author Marius Benkert
   */
  it('Normalfall, einfache Parameter. Finde Minimum aus Kosten Matrix', () => {
    // @ts-ignore
    expect(SpaltenMinimum.findMinimum(costMatrix, 2, offerArray, demandArray)).toEqual([1, 2]);
  });

  it('Normalfall, mehrere Minima in einer Spalte. Finde Minimum aus Kostenmatrix', () => {
    offerArray = [3, 4, 5];
    demandArray = [5, 3, 2, 2];
    // @ts-ignore
    expect(SpaltenMinimum.findMinimum(costMatrix, 0, offerArray, demandArray)).toEqual([0, 0]);
  });
});
