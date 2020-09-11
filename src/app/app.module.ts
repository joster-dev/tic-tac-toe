import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormControlModule } from '@joster-dev/form-control';
import { IconModule } from '@joster-dev/icon';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { FormComponent } from './game/form/form.component';
import { CellComponent } from './game/cell/cell.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FormComponent,
    CellComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormControlModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
