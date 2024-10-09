import { Injectable } from '@angular/core';
import { Form } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  model = new Form();

  constructor() { }
}
