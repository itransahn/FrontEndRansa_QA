import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropietariosInforComponent } from './propietarios-infor.component';

describe('PropietariosInforComponent', () => {
  let component: PropietariosInforComponent;
  let fixture: ComponentFixture<PropietariosInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropietariosInforComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropietariosInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
