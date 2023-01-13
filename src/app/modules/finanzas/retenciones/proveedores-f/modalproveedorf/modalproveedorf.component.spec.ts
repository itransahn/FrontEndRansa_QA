import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalproveedorfComponent } from './modalproveedorf.component';

describe('ModalproveedorfComponent', () => {
  let component: ModalproveedorfComponent;
  let fixture: ComponentFixture<ModalproveedorfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalproveedorfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalproveedorfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
