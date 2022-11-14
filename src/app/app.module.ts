import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChaosControlModule } from '@joster-dev/chaos-control';
import { IconModule } from '@joster-dev/icon';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { CellComponent } from './game/cell/cell.component';
import { FormComponent } from './game/form/form.component';


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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
