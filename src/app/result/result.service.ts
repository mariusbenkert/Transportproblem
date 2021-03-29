import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseStep } from '@procedures/baseProcedures/BaseStep';
import { NordWestEcken } from '@procedures/baseProcedures/nordWestEcken';
import { SpaltenMinimum } from '@procedures/baseProcedures/spaltenMinimum';
import { MatrixMinimum } from '@procedures/baseProcedures/matrixMinimum';
import { SteppingStoneBase } from '@procedures/steppingStoneProcedures/steppingStoneBase';
import { SteppingStoneStep } from '@procedures/steppingStoneProcedures/steppingStoneStep';
import { SteppingStoneHelper } from '@procedures/steppingStoneProcedures/steppingStoneHelper';

@Injectable({
  providedIn: 'root'
})

/**
 * Service für das Aufrufen der Prozeduren und das Verwalten der States der Ergebnisse 
 * @author Marius Benkert
 */

export class ResultService {

  // BaseProcedure result fields
  private resultSubjectBase: BehaviorSubject<BaseStep> = new BehaviorSubject<BaseStep>(null);
  result$ = this.resultSubjectBase.asObservable();

  resultPath: BaseStep[];

  private currentStepSubject: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  currentStep$ = this.currentStepSubject.asObservable();

  get currentStep() {
    return this.currentStepSubject.value;
  }

  baseResultTotalCost: number;

  // SteppingStone result fields
  private resultSubjectSteppingStone: BehaviorSubject<SteppingStoneStep> = new BehaviorSubject<SteppingStoneStep>(null);
  resultSteppingStone$ = this.resultSubjectSteppingStone.asObservable();

  resultPathSteppingStone: SteppingStoneStep[];

  private currentStepSubjectSteppingStone: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  currentStepSteppingStone$ = this.currentStepSubjectSteppingStone.asObservable();

  get currentStepSteppingStone() {
    return this.currentStepSubjectSteppingStone.value;
  }

  steppingStoneBase = new SteppingStoneBase();

  // Input data from Input-Component
  baseResultMatrix: number[][];

  costMatrix: number[][];
  offerArray: number[];
  demandArray: number[];

  sumResources: number;

  constructor() { }

  // BaseProcedure Handling
  calculateBaseResult(procedure: string) {
    const cloneCostMatrix = [];

    for (let i = 0; i < this.costMatrix.length; i++) {
      cloneCostMatrix[i] = this.costMatrix[i].slice();
    }

    const cloneofferArray = [...this.offerArray];
    const clonedemandArray = [...this.demandArray];

    switch (procedure) {
      case 'nordwestEcken':
        this.resultPath = NordWestEcken.solve(cloneofferArray, clonedemandArray);
        break;
      case 'spaltenMinimum':
        this.resultPath = SpaltenMinimum.solve(cloneCostMatrix, cloneofferArray, clonedemandArray);
        break;
      case 'matrixMinimum':
        this.resultPath = MatrixMinimum.solve(cloneCostMatrix, cloneofferArray, clonedemandArray);
        break;
    }

    const pathLength = this.resultPath.length - 1;
    const result = this.resultPath[pathLength];
    this.currentStepSubject.next(pathLength);

    this.baseResultMatrix = this.resultPath[pathLength].resultMatrix;

    this.resultSubjectBase.next(result);

    this.baseResultTotalCost = SteppingStoneHelper.calculateTotalCostsOfMatrix(
      this.baseResultMatrix,
      this.costMatrix,
      this.offerArray.length,
      this.demandArray.length
    );

    document.getElementById('results').style.display = 'block';
  }

  calculateTotalCostBase(): number {
    return SteppingStoneHelper.calculateTotalCostsOfMatrix(
      this.baseResultMatrix,
      this.costMatrix,
      this.offerArray.length,
      this.demandArray.length
    );
  }

  changeStepBase(direction: number) {
    const nextStep = this.currentStep + direction;

    const isLastStep = nextStep > this.resultPath.length - 1;
    const isFirstStep = nextStep < 0;

    if (isLastStep || isFirstStep) {
      return;
    }

    this.resultSubjectBase.next(this.resultPath[nextStep]);
    this.currentStepSubject.next(nextStep);
  }

  setStepBase(index: number) {
    this.currentStepSubject.next(index);
    this.resultSubjectBase.next(this.resultPath[index]);
  }

  // SteppingStone Handling
  getSteppingStoneResult() {
    this.resultPathSteppingStone = this.steppingStoneBase.solve(
      this.baseResultMatrix,
      this.costMatrix,
      this.offerArray,
      this.demandArray,
      this.demandArray.length,
      this.offerArray.length
    );

    const pathLength = this.resultPathSteppingStone.length - 1;
    const result = this.resultPathSteppingStone[pathLength];
    this.currentStepSubjectSteppingStone.next(pathLength);

    this.resultSubjectSteppingStone.next(result);
  }

  changeStepSteppingStone(direction: number) {
    const nextStep = this.currentStepSteppingStone + direction;

    const isLastStep = nextStep > this.resultPathSteppingStone.length - 1;
    const isFirstStep = nextStep < 0;

    if (isLastStep || isFirstStep) {
      return;
    }

    this.currentStepSubjectSteppingStone.next(nextStep);
    this.resultSubjectSteppingStone.next(this.resultPathSteppingStone[nextStep]);
  }

  setStepSteppingStone(index: number) {
    this.currentStepSubjectSteppingStone.next(index);
    this.resultSubjectSteppingStone.next(this.resultPathSteppingStone[index]);
  }

  // Reset all currently used Subjects
  resetAllSubjects() {
    this.resultSubjectBase.next(null);
    this.currentStepSubject.next(null);
    this.resultSubjectSteppingStone.next(null);
    this.currentStepSubjectSteppingStone.next(null);
  }
}
