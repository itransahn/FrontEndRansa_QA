import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPasesComponent } from './historial-pases.component';

describe('HistorialPasesComponent', () => {
  let component: HistorialPasesComponent;
  let fixture: ComponentFixture<HistorialPasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialPasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
