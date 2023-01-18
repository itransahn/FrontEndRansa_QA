import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermedioRetComponent } from './intermedio-ret.component';

describe('IntermedioRetComponent', () => {
  let component: IntermedioRetComponent;
  let fixture: ComponentFixture<IntermedioRetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntermedioRetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntermedioRetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
