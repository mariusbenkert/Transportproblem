import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { NwsComponent } from './nws/nws.component';
import { SpminComponent } from './spmin/spmin.component';
import { InputComponent } from './input/input.component';
import { ResultComponent } from './result/result.component';
import { ExplanationComponent } from './explanation/explanation.component';
import { ExampleComponent } from './example/example.component';

//Hier werden alle Komponenten geladen und für die Pfade/Routes importiert
@NgModule({
   declarations: [
      AppComponent,
      routingComponents,
      NwsComponent,
      SpminComponent,
      InputComponent,
      ExplanationComponent,
      ResultComponent,
      ExampleComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
