import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {

chosenProcedure: string;

constructor() { }

setProcedure(procedure: string) {
  this.chosenProcedure = procedure;
}

getChosenProcedure(): string{
  switch (this.chosenProcedure) {
    case 'nordwestEcken': {
      return 'Nordwesteckenregel';
    }
    case 'spaltenMinimum': {
      return 'Spaltenminimumregel';
    }
    case 'matrixMinimum': {
      return 'Matrixminimumregel';
    }
  }
}

}
