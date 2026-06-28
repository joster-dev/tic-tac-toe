import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cell } from '../../models';

import { CellComponent } from './cell.component';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cell', new Cell(0, 0));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
