import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascarasInforComponent } from './mascaras-infor.component';

describe('MascarasInforComponent', () => {
  let component: MascarasInforComponent;
  let fixture: ComponentFixture<MascarasInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MascarasInforComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascarasInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
