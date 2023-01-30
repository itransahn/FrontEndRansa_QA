import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasesEstandarComponent } from './pases-estandar.component';

describe('PasesEstandarComponent', () => {
  let component: PasesEstandarComponent;
  let fixture: ComponentFixture<PasesEstandarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasesEstandarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasesEstandarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
