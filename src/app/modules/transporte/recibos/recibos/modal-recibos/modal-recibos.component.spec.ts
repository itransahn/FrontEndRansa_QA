import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecibosComponent } from './modal-recibos.component';

describe('ModalRecibosComponent', () => {
  let component: ModalRecibosComponent;
  let fixture: ComponentFixture<ModalRecibosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRecibosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRecibosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
