import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ChaosControlModule } from '@joster-dev/chaos-control';
import { IconModule } from '@joster-dev/icon';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { CellComponent } from './game/cell/cell.component';
import { FormComponent } from './game/form/form.component';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CellComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    ChaosControlModule,
    IconModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
