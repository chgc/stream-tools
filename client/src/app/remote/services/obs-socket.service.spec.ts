import { TestBed, inject } from '@angular/core/testing';

import { ObsSocketService } from './obs-socket.service';
import { WebSocketSubject } from 'rxjs/webSocket';

describe('ObsSocketService', () => {
  let service: ObsSocketService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObsSocketService]
    });

    service = TestBed.get(ObsSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return WbeSocketSubect', () => {
    expect(service.connect()).toEqual(
      new WebSocketSubject(`ws://localhost:4444`)
    );

    expect(service.connect('127.0.0.1', '8888')).toEqual(
      new WebSocketSubject(`ws://127.0.0.1:8888`)
    );
  });
});
