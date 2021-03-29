import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ResultService } from './result.service';
import { ProcedureService } from '../procedure.service';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { BaseStep } from '@procedures/baseProcedures/BaseStep';
import { SteppingStoneStep } from '@procedures/steppingStoneProcedures/steppingStoneStep';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnDestroy {

  // BaseProcedure fields
  resultMatrixBase: number[][];
  offerArrayBase: number[];
  demandArrayBase: number[];
  totalCostBase: number;

  basePathArray: BaseStep[];
  currentStepBase$: Observable<number>;

  // SteppingStone fields
  resultMatrixSteppingStone: number[][];
  offerArraySteppingStone: number[];
  demandArraySteppingStone: number[];
  allDeterminants: string[];
  totalCostSteppingStone: number;

  steppingStonePathArray: SteppingStoneStep[];
  currentStepSteppingStone$: Observable<number>;

  // Indicates if component is alive, if not close subscriptions
  isAlive: boolean;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    const baseResultShown = this.resultMatrixBase === null;
    const steppingStoneResultShown = this.resultMatrixSteppingStone === null;

    switch (key) {
      case 'ArrowLeft':
        if (baseResultShown) {
          return;
        }

        this.changeStepBase(-1);
        break;
      case 'ArrowRight':
        if (baseResultShown) {
          return;
        }

        this.changeStepBase(1);
        break;
      case 'a':
        if (steppingStoneResultShown) {
          return;
        }

        this.changeStepSteppingStone(-1);
        break;
      case 'd':
        if (steppingStoneResultShown) {
          return;
        }

        this.changeStepSteppingStone(1);
        break;
    }
  }

  constructor(private resultService: ResultService, private procedureService: ProcedureService) {
    this.basePathArray = [];
    this.steppingStonePathArray = [];

    this.resultMatrixBase = null;

    this.isAlive = true;
  }

  ngOnInit(): void {
    this.initializeObservables();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  getSteppingStoneResult() {
    this.resultService.getSteppingStoneResult();
  }

  styleMatrix(newColumn: HTMLTableDataCellElement, newParagraph: HTMLParagraphElement, x: number, y: number) {
    newParagraph.style.border = '1px solid #9D9D9D';
    newParagraph.style.width = '45px';
    newParagraph.style.height = '25px';
    newParagraph.style.fontSize = '18px';
    newParagraph.style.textAlign = 'center';
    newParagraph.style.marginTop = '0';
    newParagraph.style.marginBottom = '0';
    newParagraph.style.fontWeight = 'bold';
    newParagraph.id = 'line' + x + 'c' + y;
    newColumn.appendChild(newParagraph);
  }

  showMatrix(selectedTable: string, resultMatrix: number[][], offerArray: number[], demandArray: number[]) {
    document.getElementById('titleBase').innerHTML = 'Ausgabe der ' + this.procedureService.getChosenProcedure();
    document.getElementById('baseProcedureContainer').style.visibility = 'initial';

    if (this.resultMatrixSteppingStone != null) {
      document.getElementById('steppingStoneContainer').style.visibility = 'initial';
    }

    const tableBody: HTMLElement = document.getElementById(selectedTable);
    tableBody.innerHTML = '';


    for (let k = +0; k <= (resultMatrix.length + 1); k++) {
      const newLine = document.createElement('tr');
      newLine.id = selectedTable === 'steppingStoneOutput' ? 'sli' + k : 'oli' + k;
      // newLine.id = 'li' + k;
      tableBody.appendChild(newLine);
      const line = document.getElementById(selectedTable === 'steppingStoneOutput' ? 'sli' + k : 'oli' + k);
      // const line = document.getElementById('li' + k);

      for (let i = +0; i <= (resultMatrix[0].length + 1); i++) {
        const newColumn = document.createElement('td');

        if (k === 0 && i === 0) { }

        else if (k === (resultMatrix.length + 1) && i === 0) {
          newColumn.innerHTML = 'b <sub>j</sub>';
          newColumn.style.textAlign = 'center';
        }

        else if (i === (resultMatrix[0].length + 1) && k === 0) {
          newColumn.innerHTML = 'a <sub>i</sub>';
          newColumn.style.textAlign = 'center';
        }

        else if (k === 0) {
          newColumn.innerHTML = 'B <sub>' + i + '</sub>';
          newColumn.style.textAlign = 'center';
        }

        else if (i === 0) {
          newColumn.innerHTML = 'A <sub>' + k + '</sub>';
          newColumn.style.textAlign = 'center';
        }
        else if (k === (resultMatrix.length + 1) && i === (resultMatrix[0].length + 1)) {
          const newParagraph = document.createElement('p');
          this.styleMatrix(newColumn, newParagraph, k, i);
          newParagraph.innerHTML = this.resultService.sumResources.toString();

        }
        else if (i === (resultMatrix[0].length + 1)) {
          const newParagraph = document.createElement('p');
          this.styleMatrix(newColumn, newParagraph, k, i);
          newParagraph.innerHTML = offerArray[k - 1] === null ? '' : (offerArray[k - 1]).toString();
        }
        else if (k === (resultMatrix.length + 1)) {
          const newParagraph = document.createElement('p');
          this.styleMatrix(newColumn, newParagraph, k, i);
          newParagraph.innerHTML = demandArray[i - 1] === null ? '' : (demandArray[i - 1]).toString();
        }

        else {
          const a = document.createElement('p');
          this.styleMatrix(newColumn, a, k, i);
          a.innerHTML = resultMatrix[k - 1][i - 1] === null ? '' : (resultMatrix[k - 1][i - 1]).toString();
        }
        line.appendChild(newColumn);
      }
    }
  }

  changeStepBase(direction: number) {
    this.resultService.changeStepBase(direction);
  }

  setStepBase(index: number) {
    this.resultService.setStepBase(index);
  }

  changeStepSteppingStone(direction: number) {
    this.resultService.changeStepSteppingStone(direction);
  }

  setStepSteppingStone(index: number) {
    this.resultService.setStepSteppingStone(index);
  }

  /**
   * Initialisiert die Observer, welche die Werte von den BehaviourSubjects im Result-Service erhalten
   * @author Marius Benkert
   */
  private initializeObservables() {

    // Init BaseProcedures
    this.resultService.result$.pipe(takeWhile(() => this.isAlive)).subscribe(result => {
      if (result != null) {
        this.resultMatrixBase = result.resultMatrix;
        this.offerArrayBase = result.offerArray;
        this.demandArrayBase = result.demandArray;
        this.totalCostBase = this.resultService.calculateTotalCostBase();

        this.showMatrix('outputTable', this.resultMatrixBase, this.offerArrayBase, this.demandArrayBase);

        this.basePathArray = this.resultService.resultPath;
      }
    });

    this.currentStepBase$ = this.resultService.currentStep$;

    // Init SteppingStone
    this.resultService.resultSteppingStone$.pipe(takeWhile(() => this.isAlive)).subscribe(result => {
      if (result != null) {
        this.resultMatrixSteppingStone = result.changedMatrix;
        this.offerArraySteppingStone = result.offerArray;
        this.demandArraySteppingStone = result.demandArray;
        this.allDeterminants = result.allDeterminants;
        this.totalCostSteppingStone = result.totalCosts;

        this.showMatrix('steppingStoneOutput', this.resultMatrixSteppingStone, this.offerArraySteppingStone, this.demandArraySteppingStone);

        this.steppingStonePathArray = this.resultService.resultPathSteppingStone;
      }
    });

    this.currentStepSteppingStone$ = this.resultService.currentStepSteppingStone$;
  }
}
