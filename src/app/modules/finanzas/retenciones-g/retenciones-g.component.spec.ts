import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesGComponent } from './retenciones-g.component';

describe('RetencionesGComponent', () => {
  let component: RetencionesGComponent;
  let fixture: ComponentFixture<RetencionesGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetencionesGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetencionesGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
