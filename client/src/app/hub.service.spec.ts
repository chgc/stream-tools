import { TestBed, inject } from '@angular/core/testing';

import { HubService } from './hub.service';

describe('HubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HubService]
    });
  });

  it('should be created', inject([HubService], (service: HubService) => {
    expect(service).toBeTruthy();
  }));
});
