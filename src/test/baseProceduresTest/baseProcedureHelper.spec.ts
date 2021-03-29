import { BPHelper } from '@procedures/baseProcedures/baseProcedureHelper';

/**
 * Testen, ob eine neue Matrix ordnungsgemäß erstellt wird
 * @author Paul Väthjunker, Marius Benkert
 */
describe('Erstelle Leere Liefermatrix', () => {

  it('Normalfall, einfache Positive Werte', () => {
    const result = BPHelper.createMatrix(4, 5);
    expect(result.length).toEqual(4);
    expect(result[0].length).toEqual(5);
  });

  it('Fehlerfall, werte kleiner gleich 0', () => {
    expect(() => {
      BPHelper.createMatrix(-4, 5);
    }).toThrow(new RangeError('Cannot create Matrix <= 0'));
    expect(() => {
      BPHelper.createMatrix(4, -5);
    }).toThrow(new RangeError('Cannot create Matrix <= 0'));
    expect(() => {
      BPHelper.createMatrix(0, 5);
    }).toThrow(new RangeError('Cannot create Matrix <= 0'));
    expect(() => {
      BPHelper.createMatrix(4, 0);
    }).toThrow(new RangeError('Cannot create Matrix <= 0'));
  });
});

/**
 * Testen, ob die Kostenmatrix richtig geändert wird
 * @author Paul Väthjunker, Marius Benkert
 */
describe('Kosten Matrix verändern', () => {
  let costMatrix: number[][];

  beforeEach(() => {
    costMatrix = [
      [7, 7, 4, 7],
      [9, 5, 3, 3],
      [7, 7, 6, 4]
    ];
  });

  it('Normalfall, nur eine Zeile wird gestrichen', () => {
    BPHelper.updateCostMatrix(costMatrix, 1, null);
    expect([
      [7, 7, 4, 7],
      [null, null, null, null],
      [7, 7, 6, 4]
    ]).toEqual(costMatrix);
  });

  it('Normalfall, nur eine Spalte wird gestrichen', () => {
    BPHelper.updateCostMatrix(costMatrix, null, 2);
    expect([
      [7, 7, null, 7],
      [9, 5, null, 3],
      [7, 7, null, 4]
    ]).toEqual(costMatrix);
  });

  it('Normalfall, sowohl eine Spalte als auch eine Zeile werden gestrichen', () => {
    BPHelper.updateCostMatrix(costMatrix, 2, 2);
    expect([
      [7, 7, null, 7],
      [9, 5, null, 3],
      [null, null, null, null]
    ]).toEqual(costMatrix);
  });

  it('Fehlerfall, Zeilenangabe größer als Matrix', () => {
    expect(() => {
      BPHelper.updateCostMatrix(costMatrix, 10, 2);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });

  it('Fehlerfall, Spaltenangabe größer als Matrix', () => {
    expect(() => {
      BPHelper.updateCostMatrix(costMatrix, 2, 10);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });

  it('Fehlerfall, Zeileangabe kleiner als Matrix', () => {
    expect(() => {
      BPHelper.updateCostMatrix(costMatrix, -2, 2);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });

  it('Fehlerfall, Spaltenangabe kleiner als Matrix', () => {
    expect(() => {
      BPHelper.updateCostMatrix(costMatrix, 2, -2);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });
});

/**
 * Testen, ob das beste Minimum aus einer Liste von Minima gefunden wird
 * @author Paul Väthjunker, Marius Benkert
 */
describe('Finde Minimum, das am besten gefüllt werden kann', () => {
  let offerArr: number[];
  let minima: number[][];
  let demandArr: number[];

  beforeEach(() => {
    offerArr = [10, 8, 7];
    demandArr = [6, 5, 8, 6];
  });

  it("Normalfall, eindeutig. Finde Minimum das am meisten auffüllt", () => {
    minima = [[1, 2,], [0, 3]];
    expect(BPHelper.bestFittingMinimum(minima, offerArr, demandArr)).toEqual([1, 2]);
  });

  it("Normalfall, mehrere Minima eindeutig. Finde Minimum das am meisten auffüllt", () => {
    minima = [[1, 2,], [0, 2]];
    offerArr = [10, 9, 7];
    expect(BPHelper.bestFittingMinimum(minima, offerArr, demandArr)).toEqual([1, 2]);
  });
});

/**
 * Testen, ob Ressourcen richtig verteilt werden
 * @author Paul Väthjunker, Marius Benkert
 */
describe('Erneuere Angebot und Bedarfs Arrays', () => {
  let offerArr: number[];
  let result: number[][];
  let demandArr: number[];

  beforeEach(() => {
    result = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];

    offerArr = [10, 8, 7];
    demandArr = [6, 5, 8, 6];
  });

  it('Normalfall, einfache Parameter', () => {
    BPHelper.updateResources(2, 2, offerArr, demandArr, result);

    expect(result).toEqual([
      [null, null, null, null],
      [null, null, null, null],
      [null, null, 7, null]
    ]);
    expect(offerArr).toEqual([10, 8, 0]);
    expect(demandArr).toEqual([6, 5, 1, 6]);
  });

  it('Fehlerfall, Spaltenangabe größer als Kostenmatrix', () => {
    expect(() => {
      BPHelper.updateResources(10, 2, offerArr, demandArr, result);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });

  it('Fehlerfall, Zeilenangabe größer als Kostenmatrix', () => {
    expect(() => {
      BPHelper.updateResources(2, 10, offerArr, demandArr, result);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });

  it('Fehlerfall, Spaltenangabe kleiner als Kostenmatrix', () => {
    expect(() => {
      BPHelper.updateResources(-2, 2, offerArr, demandArr, result);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });

  it('Fehlerfall, Zeilenangabe kleiner als Kostenmatrix', () => {
    expect(() => {
      BPHelper.updateResources(2, -2, offerArr, demandArr, result);
    }).toThrow(new RangeError('x and y cannot lay outside costMatrix'));
  });
});
