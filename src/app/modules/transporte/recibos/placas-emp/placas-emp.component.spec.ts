import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacasEmpComponent } from './placas-emp.component';

describe('PlacasEmpComponent', () => {
  let component: PlacasEmpComponent;
  let fixture: ComponentFixture<PlacasEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacasEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacasEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
