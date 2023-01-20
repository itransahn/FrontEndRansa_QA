import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalrgComponent } from './modalrg.component';

describe('ModalrgComponent', () => {
  let component: ModalrgComponent;
  let fixture: ComponentFixture<ModalrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalrgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
