import { TestBed } from '@angular/core/testing';

import { InforService } from './infor.service';

describe('InforService', () => {
  let service: InforService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InforService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
