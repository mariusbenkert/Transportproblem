import { ProcedureService } from './../procedure.service';
import { Component, OnInit, } from '@angular/core';
import { ResultService } from './../result/result.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})

export class InputComponent implements OnInit {

  procedure = this.procedureService.chosenProcedure;

  constructor(private resultService: ResultService, private procedureService: ProcedureService) { }

  // Zeilen & Spaltenvektor
  linecount = 3;
  columncount = 4;
  // selector auswahl 2 - 10 für Zeilen
  lineitems: any[] = [
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '10' },
  ];
  // selector auswahl (2 - 10) für Spalten
  columnitems: any[] = this.lineitems;

  costMatrix = [[]];
  offerArray = [];
  demandArray = [];

  sumResources(resources: number[]): number {
    let sum = 0;
    resources.forEach(E => {
      sum += E;
    });
    return sum;
  }

  ngOnInit() {
    this.newInputMatrix();
  }

  // Methode für Erfassung des Auswahlwerts
  line(id: number) {
    this.linecount = +id;
  }
  column(id: number) {
    this.columncount = +id;
  }

  resetMatrixValues()
  {
    this.costMatrix = [[]];
    this.demandArray = [];
    this.offerArray = [];
    document.getElementById('results').style.display = 'none';
  }

  updateLine($event: number) {
    this.line($event);
    this.newInputMatrix();
    this.resetMatrixValues();
    this.resultService.resetAllSubjects();
  }
  updateColumn($event: number) {
    this.column($event);
    this.newInputMatrix();
    this.resetMatrixValues();
  }

  // Methode zur Matrixerstellung
  newInputMatrix() {
    const tableBody: HTMLElement = document.getElementById('inputTable');
    tableBody.innerHTML = '';

    for (let k = 0; k <= (this.linecount + 1); k++) {
      const newLine = document.createElement('tr');
      newLine.id = 'l' + k;
      tableBody.appendChild(newLine);
      const line = document.getElementById('l' + k);

      for (let i = 0; i <= (this.columncount + 1); i++) {
        const newColumn = document.createElement('td');

        if (k === 0 && i === 0) { }

        else if (k === (this.linecount + 1) && i === 0) {
          newColumn.innerHTML = 'b <sub>j</sub>';
          newColumn.style.textAlign = 'center';
        }

        else if (i === (this.columncount + 1) && k === 0) {
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

        else {
          const inputField = document.createElement('input');
          inputField.type = 'number';
          inputField.style.width = '45px';
          inputField.style.height = '25px';
          inputField.style.fontSize = '18px';
          inputField.style.textAlign = 'center';
          inputField.id = 'l' + k + 'c' + i;
          newColumn.appendChild(inputField);
        }
        line.appendChild(newColumn);
      }
    }
  }

  // Speicherung der Matrixwerte in einem Array
  getCostMatrix(): number[][] {
    const x: HTMLElement = document.getElementById('tbl');

    for (let k = 1; k <= this.linecount; k++) {
      this.costMatrix[k] = [];
      for (let i = 1; i <= this.columncount; i++) {
        let inputFieldValue = (document.getElementById('l' + k + 'c' + i) as HTMLInputElement).value;
        if (inputFieldValue !== '') {
          this.costMatrix[k][i] = +inputFieldValue;
          document.getElementById('l' + k + 'c' + i).style.borderColor = '';
          document.getElementById('errormessagecostMatrix').innerHTML = '';
        }
        else {
          document.getElementById('l' + k + 'c' + i).style.borderColor = 'orange';
          document.getElementById('errormessagecostMatrix').innerHTML = 'Die Kostenmatrix ist nicht vollständig';
        }
      }
      this.costMatrix[k].shift();
    }
    this.costMatrix.shift();
    return this.costMatrix;
  }

  getOfferArray(): number[] {
    const col = this.columncount + 1;
    for (let k = 1; k <= this.linecount; k++) {
      let inputFieldValue = (document.getElementById('l' + k + 'c' + col) as HTMLInputElement).value;
      if (inputFieldValue !== '') {
        this.offerArray[k] = +inputFieldValue;
        document.getElementById('l' + k + 'c' + col).style.borderColor = '';
        document.getElementById('errormessageoffer').innerHTML = '';
      }
      else {
        document.getElementById('l' + k + 'c' + col).style.borderColor = 'grey';
        document.getElementById('errormessageoffer').innerHTML = 'Das Angebot ist nicht vollständig';
      }
    }
    this.offerArray.shift();
    return this.offerArray;
  }
  // // Holt sich den Bedarfs-Array
  getDemandArray(): number[] {
    const line = this.linecount + 1;
    for (let i = 1; i <= this.columncount; i++) {
      let inputFieldValue = (document.getElementById('l' + line + 'c' + i) as HTMLInputElement).value;
      if (inputFieldValue !== '') {
        this.demandArray[i] = +inputFieldValue;
        document.getElementById('l' + line + 'c' + i).style.borderColor = '';
        document.getElementById('errormessagedemand').innerHTML = '';
      }
      else {
        document.getElementById('l' + line + 'c' + i).style.borderColor = 'grey';
        document.getElementById('errormessagedemand').innerHTML = 'Die Nachfrage ist nicht vollständig';
      }
    }
    this.demandArray.shift();
    return this.demandArray;
  }

  start() {
    if(this.procedure != null)
    {
      this.resultService.costMatrix = this.getCostMatrix();
      this.resultService.offerArray = this.getOfferArray();
      this.resultService.demandArray = this.getDemandArray();

      this.resultService.sumResources = this.sumResources(this.demandArray);

      this.resultService.calculateBaseResult(this.procedure);
    }
    else{
      document.getElementById('errormessagenoPath').innerHTML = 'Es wurde kein Verfahren ausgewählt';
    }
  }
}
