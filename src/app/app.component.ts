import { Component } from '@angular/core';
import { ProcedureService } from './procedure.service';
import { ResultService } from './result/result.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//exportklasse um von Appcomponent an die Unterkomponenten zu exportieren
export class AppComponent {

  title = 'Transportproblem';

  procedure: string;

  constructor(private procedureService: ProcedureService, private resultService: ResultService) { }
  //Methode um den einzelnen Verfahren einen (bool-)Wert zu zuordnen. Um Verfahren zu unterscheiden.
  setProcedure(procedure: string) {
    this.procedure = procedure;
    this.resultService.resetAllSubjects();
    this.procedureService.setProcedure(procedure);
  }
}
