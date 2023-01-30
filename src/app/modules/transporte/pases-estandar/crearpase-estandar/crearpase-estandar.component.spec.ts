import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearpaseEstandarComponent } from './crearpase-estandar.component';

describe('CrearpaseEstandarComponent', () => {
  let component: CrearpaseEstandarComponent;
  let fixture: ComponentFixture<CrearpaseEstandarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearpaseEstandarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearpaseEstandarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
