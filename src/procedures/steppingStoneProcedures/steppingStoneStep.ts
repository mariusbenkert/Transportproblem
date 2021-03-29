export interface SteppingStoneStep {

/**
 * Interface, welches als Zwischenspeicher des Optimierungsverfahrens Stepping-Stone dient
 */

    changedMatrix: number[][];
    offerArray: number[];
    demandArray: number[];
    totalCosts : number;
    allDeterminants : Array<string>;

  }