import { ProcedureService } from '../procedure.service';
import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css']
})

// export Klasse zum Kombinieren der Komponenten
export class ExplanationComponent implements OnInit {


  chosenProcedure: string;
  // Erstellung eines neuen Objekts mit verändertem Verfahrenswert
  constructor(private procedureService: ProcedureService) {
  }


  ngOnInit() {
    this.chosenProcedure = this.procedureService.chosenProcedure;
    this.showExplanation(this.chosenProcedure);
  }

  // Funktion zur Anzeige der Erklärungstexte
  showExplanation(procedure) {

    switch (procedure) {
      case 'nordwestEcken': {
        document.getElementById('txt_nwv_expl').style.display = 'block';
        break;
      }
      case 'spaltenMinimum': {
        document.getElementById('txt_smv_expl').style.display = 'block';
        break;
      }
      case 'matrixMinimum': {
        document.getElementById('txt_mmv_expl').style.display = 'block';
        break;
      }
      default: {
        document.getElementById('txtdefault').style.display = 'block';
        break;
      }
    }
  }
}

