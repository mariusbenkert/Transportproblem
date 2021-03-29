import { Component, OnInit } from '@angular/core';
import { ResultService } from '../result/result.service';
import { ProcedureService } from '../procedure.service';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  constructor(private resultService: ResultService, private procedureService: ProcedureService) { }

  procedure = this.procedureService.chosenProcedure;

  linecount = 3;
  columncount = 4;

  testcostmatrix =
    [[12, 14, 10, 5],
    [11, 15, 10, 8],
    [10, 18, 15, 9]];
  testoffer = [80, 80, 120];
  testdemand = [60, 70, 100, 50];

  sumResources(resources: number[]): number {
    let sum = 0;
    resources.forEach(E => {
      sum += E;
    });
    return sum;
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

  showMatrix(resultMatrix: number[][], offerArr: number[], demandArr: number[]) {
    const tableBody: HTMLElement = document.getElementById('inputTable');
    tableBody.innerHTML = '';
    for (let k = +0; k <= (resultMatrix.length + 1); k++) {
      const newLine = document.createElement('tr');
      newLine.id = 'l' + k;
      tableBody.appendChild(newLine);
      const line = document.getElementById('l' + k);

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
        newParagraph.innerHTML = this.sumResources(this.testdemand).toString();

      }
      else if (i === (resultMatrix[0].length + 1)) {
        const newParagraph = document.createElement('p');
        this.styleMatrix(newColumn, newParagraph, k, i);
        newParagraph.innerHTML = offerArr[k - 1] === null ? '' : (offerArr[k - 1]).toString();
      }
      else if (k === (resultMatrix.length + 1)) {
        const newParagraph = document.createElement('p');
        this.styleMatrix(newColumn, newParagraph, k, i);
        newParagraph.innerHTML = demandArr[i - 1] === null ? '' : (demandArr[i - 1]).toString();
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

  ngOnInit() {
    if (this.procedure != null) {
      this.showMatrix(this.testcostmatrix, this.testoffer, this.testdemand);
      this.resultService.costMatrix = this.testcostmatrix;
      this.resultService.offerArray = this.testoffer;
      this.resultService.demandArray = this.testdemand;
      this.resultService.sumResources = this.sumResources(this.testdemand);

      this.resultService.calculateBaseResult(this.procedure);
    }
    else {
      document.getElementById('errormessagenoPath').innerHTML = 'Es wurde kein Verfahren ausgewählt';
    }
  }
}
