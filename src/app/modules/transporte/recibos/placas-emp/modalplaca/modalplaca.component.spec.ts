import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalplacaComponent } from './modalplaca.component';

describe('ModalplacaComponent', () => {
  let component: ModalplacaComponent;
  let fixture: ComponentFixture<ModalplacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalplacaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalplacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
