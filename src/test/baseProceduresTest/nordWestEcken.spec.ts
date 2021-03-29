import { NordWestEcken } from '@procedures/baseProcedures/nordWestEcken';

/**
 * Testen, ob Nord-West-Eckenregel richtiges Ergebnis-Array ausgibt
 * @author Paul Väthjunker
 */
describe('Nord-West-Eckenregel', () => {

  let offerArray: number[];
  let demandArray: number[];

  beforeEach(() => {
    demandArray = [60, 70, 100, 50];
    offerArray = [80, 80, 120];
  });

  it('Normalfall, einfache Parameter. Solver', () => {
    const path = NordWestEcken.solve(offerArray, demandArray);
    const resultMatrix = path[path.length - 1].resultMatrix;

    expect(resultMatrix).toEqual(
      [[60, 20, null, null],
      [null, 50, 30, null],
      [null, null, 70, 50]]);
  });

  it('Pfad des Solvers ausgeben', () => {
    const path = NordWestEcken.solve(offerArray, demandArray);

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
          [60, null, null, null],
          [null, null, null, null],
          [null, null, null, null]
        ],
        offerArray: [20, 80, 120],
        demandArray: [0, 70, 100, 50]
      },
      {
        resultMatrix: [
          [60, 20, null, null],
          [null, null, null, null],
          [null, null, null, null]
        ],
        offerArray: [0, 80, 120],
        demandArray: [0, 50, 100, 50]
      },
      {
        resultMatrix: [
          [60, 20, null, null],
          [null, 50, null, null],
          [null, null, null, null]
        ],
        offerArray: [0, 30, 120],
        demandArray: [0, 0, 100, 50]
      },
      {
        resultMatrix: [
          [60, 20, null, null],
          [null, 50, 30, null],
          [null, null, null, null]
        ],
        offerArray: [0, 0, 120],
        demandArray: [0, 0, 70, 50]
      },
      {
        resultMatrix: [
          [60, 20, null, null],
          [null, 50, 30, null],
          [null, null, 70, null]
        ],
        offerArray: [0, 0, 50],
        demandArray: [0, 0, 0, 50]
      },
      {
        resultMatrix: [
          [60, 20, null, null],
          [null, 50, 30, null],
          [null, null, 70, 50]
        ],
        offerArray: [0, 0, 0],
        demandArray: [0, 0, 0, 0]
      }
    ]);
  });
});
