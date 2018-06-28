import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CaptionModel } from '../sotre/caption-items.state';
import { CaptionService } from './caption.service';

describe('CaptionService', () => {
  let service: CaptionService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CaptionService]
    });

    service = TestBed.get(CaptionService);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get caption list with id', () => {
    const testData: CaptionModel[] = [
      <CaptionModel>{
        id: '1',
        uid: 'test',
        label: 'testLabel',
        value: 'testValue',
        displayCalss: '',
        colorClass: '',
        style: ''
      }
    ];
    service.getCaptionList().subscribe(value => {
      expect(value).toEqual(testData);
    });
    const req = httpTestingController.expectOne('/api/caption/list');
    req.flush(testData);
    httpTestingController.verify();
  });

  it('should createAndUpdate Caption', async () => {
    const testData: CaptionModel[] = [
      <CaptionModel>{
        id: '1',
        uid: 'test',
        label: 'testLabel',
        value: 'testValue',
        displayCalss: '',
        colorClass: '',
        style: ''
      }
    ];
    service.createAndUpdateCaption(null, testData).subscribe();
    const reqCreate = httpTestingController.expectOne('api/caption/create');
    expect(reqCreate.request.method).toEqual('POST');

    service.createAndUpdateCaption(1, testData).subscribe();
    const reqUpdate = httpTestingController.expectOne('api/caption/update/1');
    expect(reqUpdate.request.method).toEqual('PUT');
    httpTestingController.verify();
  });

  it('should remove caption', () => {
    service.removeCaption(1).subscribe();
    const req = httpTestingController.expectOne('api/caption/remove/1');
    expect(req.request.method).toEqual('DELETE');
    httpTestingController.verify();
  });

  it('should set area Position', () => {
    service.setAreaPosition({}).subscribe();
    const req = httpTestingController.expectOne('api/caption/areaPosition');
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('should get area position object', () => {
    service.getAreaPosition().subscribe();

    const req = httpTestingController.expectOne('api/caption/areaPosition');
    expect(req.request.method).toEqual('GET');
    httpTestingController.verify();
  });

  it('should set customCSS', () => {
    service.setCustomCSS('css').subscribe();
    const req = httpTestingController.expectOne('api/caption/customCSS');
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('should get custom css', () => {
    const mockData = {
      cssStyle: 'css'
    };
    service.getCustomCSS().subscribe(value => {
      expect(value).toBe('css');
    });
    const req = httpTestingController.expectOne('api/caption/customCSS/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
    httpTestingController.verify();
  });

  it('should set obs connection information', () => {
    const host = 'localhost',
      port = 4444;
    service.setOBSConnectionInformation(host, port).subscribe();
    const req = httpTestingController.expectOne('api/caption/connectionInfo');
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });
});
