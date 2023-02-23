import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpasefComponent } from './modalpasef.component';

describe('ModalpasefComponent', () => {
  let component: ModalpasefComponent;
  let fixture: ComponentFixture<ModalpasefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalpasefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalpasefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
