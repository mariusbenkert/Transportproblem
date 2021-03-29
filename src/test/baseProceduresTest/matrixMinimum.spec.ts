import { MatrixMinimum } from '@procedures/baseProcedures/matrixMinimum';

/**
 * Testen, ob MatrixMinimum-Verfahren richtiges Ergebnis-Array ausgibt
 * @author Paul Väthjunker
 */
describe('MatrixMinimum', () => {

  let offerArray: number[];
  let demandArray: number[];
  let costMatrix: number[][];

  beforeEach(() => {
    costMatrix = [
      [12, 14, 10, 5],
      [11, 15, 10, 8],
      [10, 18, 15, 9]
    ];

    demandArray = [60, 70, 100, 50];
    offerArray = [80, 80, 120];
  });

  it('Normalfall, einfache Parameter. Solver', () => {
    const path = MatrixMinimum.solve(costMatrix, offerArray, demandArray);
    const resultMatrix = path[path.length - 1].resultMatrix;

    expect(resultMatrix).toEqual(
      [[null, 10, 20, 50],
      [null, null, 80, null],
      [60, 60, null, null]]);
  });

  it('Pfad des Solvers ausgeben', () => {
    const path = MatrixMinimum.solve(costMatrix, offerArray, demandArray);

    expect(path).toEqual([
      {
        resultMatrix: [
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null]
        ],
        offerArray: [80, 80, 120],
        demandArray: [60, 70, 100, 50]
      },
      {
        resultMatrix: [
          [null, null, null, 50],
          [null, null, null, null],
          [null, null, null, null]
        ],
        offerArray: [30, 80, 120],
        demandArray: [60, 70, 100, 0]
      },
      {
        resultMatrix: [
          [null, null, null, 50],
          [null, null, 80, null],
          [null, null, null, null]
        ],
        offerArray: [30, 0, 120],
        demandArray: [60, 70, 20, 0]
      },
      {
        resultMatrix: [
          [null, null, null, 50],
          [null, null, 80, null],
          [60, null, null, null]
        ],
        offerArray: [30, 0, 60],
        demandArray: [0, 70, 20, 0]
      },
      {
        resultMatrix: [
          [null, null, 20, 50],
          [null, null, 80, null],
          [60, null, null, null]
        ],
        offerArray: [10, 0, 60],
        demandArray: [0, 70, 0, 0]
      },
      {
        resultMatrix: [
          [null, 10, 20, 50],
          [null, null, 80, null],
          [60, null, null, null]
        ],
        offerArray: [0, 0, 60],
        demandArray: [0, 60, 0, 0]
      },
      {
        resultMatrix: [
          [null, 10, 20, 50],
          [null, null, 80, null],
          [60, 60, null, null]
        ],
        offerArray: [0, 0, 0],
        demandArray: [0, 0, 0, 0]
      }
    ]);
  });

  /**
   * Testen, ob das richtige Minimum ausgegeben wird
   * @author Paul Väthjunker
   */
  it('Normalfall, einfache Parameter. Finde Minimum aus Kostenmatrix', () => {
    // @ts-ignore
    expect(MatrixMinimum.findMinimum(costMatrix, offerArray, demandArray, offerArray.length, demandArray.length)).toEqual([0, 3]);
  });

  it('Normalfall, mehrere Minima. Finde Minimum aus Kostenmatrix', () => {
    costMatrix[0][3] = 11;
    costMatrix[1][3] = 11;
    costMatrix[2][3] = 11;
    // @ts-ignore
    expect(MatrixMinimum.findMinimum(costMatrix, offerArray, demandArray, offerArray.length, demandArray.length)).toEqual([0, 2]);
  });
});
