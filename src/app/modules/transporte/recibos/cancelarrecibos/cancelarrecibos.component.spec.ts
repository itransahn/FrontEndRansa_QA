import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarrecibosComponent } from './cancelarrecibos.component';

describe('CancelarrecibosComponent', () => {
  let component: CancelarrecibosComponent;
  let fixture: ComponentFixture<CancelarrecibosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelarrecibosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelarrecibosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
