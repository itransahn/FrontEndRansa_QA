import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesHComponent } from './retenciones-h.component';

describe('RetencionesHComponent', () => {
  let component: RetencionesHComponent;
  let fixture: ComponentFixture<RetencionesHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetencionesHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetencionesHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
