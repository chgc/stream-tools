import { TestBed, inject } from '@angular/core/testing';

import { PrizehubService } from './prizehub.service';

describe('PrizehubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrizehubService]
    });
  });

  it('should be created', inject([PrizehubService], (service: PrizehubService) => {
    expect(service).toBeTruthy();
  }));
});
