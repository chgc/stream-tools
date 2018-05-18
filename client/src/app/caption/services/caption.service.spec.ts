import { TestBed, inject } from '@angular/core/testing';

import { CaptionService } from './caption.service';
import { AngularFirestore } from 'angularfire2/firestore';

export class FakeAngularFirestore {}
describe('CaptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaptionService, { provide: AngularFirestore, useClass: FakeAngularFirestore }]
    });
  });

  it(
    'should be created',
    inject([CaptionService], (service: CaptionService) => {
      expect(service).toBeTruthy();
    })
  );
});
