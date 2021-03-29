import { ExampleComponent } from './example/example.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MminComponent } from './mmin/mmin.component';
import { NwsComponent } from './nws/nws.component';
import { SpminComponent } from './spmin/spmin.component';
import { InputComponent } from './input/input.component';
import { ExplanationComponent } from './explanation/explanation.component';

//Hier werden alle unterpfade/routes zu den verschiedenen Verfahren festgelegt
const routes: Routes = [] = [
  { path: 'Matrixminimumregel', component: MminComponent },
  { path: 'Nordwesteckenregel', component: NwsComponent },
  { path: 'Spaltenminimumregel', component: SpminComponent },
  { path: 'input', component: InputComponent },
  { path: 'explanation', component: ExplanationComponent },
  { path: 'example', component: ExampleComponent },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
  ]
})

//exportklassen für die Nutzung der Routen um Komponenten zu verknüpfen
export class AppRoutingModule { }
export const routingComponents = [MminComponent, NwsComponent, SpminComponent, InputComponent, ExplanationComponent]
