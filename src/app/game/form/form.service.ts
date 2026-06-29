import { Injectable, signal } from '@angular/core';
import { Form, botFirstMove } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private readonly defaults = new Form();

  readonly botPlayer = signal<'x' | 'o' | undefined>(this.defaults.botPlayer);
  readonly goesFirst = signal<'x' | 'o'>(this.defaults.goesFirst);
  readonly botFirstMove = signal<botFirstMove>(this.defaults.botFirstMove);
  readonly xColor = signal<string | null>(this.defaults.xColor);
  readonly oColor = signal<string | null>(this.defaults.oColor);
  readonly player1 = signal<string | null>(this.defaults.player1);
  readonly player2 = signal<string | null>(this.defaults.player2);

  // Plain `Form` view of the signals, used for persistence and imperative reads.
  get model(): Form {
    const form = new Form();
    form.botPlayer = this.botPlayer();
    form.goesFirst = this.goesFirst();
    form.botFirstMove = this.botFirstMove();
    form.xColor = this.xColor();
    form.oColor = this.oColor();
    form.player1 = this.player1();
    form.player2 = this.player2();
    return form;
  }

  set model(form: Form) {
    this.botPlayer.set(form.botPlayer);
    this.goesFirst.set(form.goesFirst);
    this.botFirstMove.set(form.botFirstMove);
    this.xColor.set(form.xColor);
    this.oColor.set(form.oColor);
    this.player1.set(form.player1);
    this.player2.set(form.player2);
  }
}
