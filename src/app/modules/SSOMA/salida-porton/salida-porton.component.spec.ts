import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaPortonComponent } from './salida-porton.component';

describe('SalidaPortonComponent', () => {
  let component: SalidaPortonComponent;
  let fixture: ComponentFixture<SalidaPortonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalidaPortonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalidaPortonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
