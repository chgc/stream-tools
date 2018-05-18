import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { CaptionService } from './caption.service';
import { AngularFirestore } from 'angularfire2/firestore';

export class FakeAngularFirestore {
  doc(path) {}
  createId() {}
}

describe('CaptionService', () => {
  let service: CaptionService;
  let af: AngularFirestore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CaptionService,
        { provide: AngularFirestore, useClass: FakeAngularFirestore }
      ]
    });

    service = TestBed.get(CaptionService);
    af = TestBed.get(AngularFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return captionDocument', () => {
    spyOn(af, 'doc');
    service.initFireStore('123');
    expect(af.doc).toHaveBeenCalledWith('caption/123');
  });

  it('should get caption list with id', () => {
    const data = [
      {
        payload: {
          id: 1,
          doc: {
            data: () => ({ name: 'test' })
          }
        }
      }
    ];
    service.myCaptionDocument = {
      collection: arg => ({
        snapshotChanges: () => of(data)
      })
    } as any;

    service.getCaptionList().subscribe(result => {
      console.log(result);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({ id: 1, name: 'test' });
    });
  });

  it('should createAndUpdate Caption', () => {
    service.myCaptionDocument = {
      collection: arg => ({
        doc: () => ({
          set: (item, options?) => item
        })
      })
    } as any;
    spyOn(af, 'createId');
    service.createAndUpdateCaption(null, {});
    expect(af.createId).toHaveBeenCalled();
    expect(service.createAndUpdateCaption(1, {})).toEqual({});
  });

  it('should remove caption', () => {
    service.myCaptionDocument = {
      collection: arg => ({
        doc: () => ({
          delete: () => Promise.resolve()
        })
      })
    } as any;
    service.removeCaption(1).then(value => {
      expect(value).toBeUndefined();
    });
  });

  it('should set area Position', () => {
    service.myCaptionDocument = {
      update: position => Promise.resolve()
    } as any;
    service.setAreaPosition({}).then(value => {
      expect(value).toBeUndefined();
    });
  });

  it('should get area position object', () => {
    const mockAreaPosition = {
      MAX_WIDTH: 0,
      MAX_HEIGHT: 0,
      START_X: 0,
      START_Y: 0
    };
    service.myCaptionDocument = {
      valueChanges: () => of(mockAreaPosition)
    } as any;

    service.getAreaPosition().subscribe(value => {
      expect(value).toEqual({
        MAX_WIDTH: 0,
        MAX_HEIGHT: 0,
        START_X: 0,
        START_Y: 0
      });
    });
  });

  it('should set customCSS', () => {
    service.myCaptionDocument = {
      set: () => Promise.resolve()
    } as any;

    service.setCustomCSS('css').then(value => {
      expect(value).toBeUndefined();
    });
  });

  it('should get custom css', () => {
    const mockData = {
      cssStyle: 'css'
    };
    service.myCaptionDocument = {
      valueChanges: () => of(mockData)
    } as any;

    service.getCustomCSS().subscribe(value => {
      expect(value).toBe('css');
    });
  });

  it('should set obs connection information', () => {
    service.myCaptionDocument = {
      set: position => Promise.resolve()
    } as any;
    const host = 'localhost',
      port = 4444;
    service.setOBSConnectionInformation(host, port).then(value => {
      expect(value).toBeUndefined();
    });
  });
});
