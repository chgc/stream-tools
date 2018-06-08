import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { BroadcastService } from './broadcast.service';

describe('BroadcastService', () => {
  let http: HttpTestingController;
  let service: BroadcastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BroadcastService]
    });
    service = TestBed.get(BroadcastService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('request from google youtube data api', () => {
    afterEach(() => {
      http.verify();
    });

    it('should call LiveBroadcasts list api', () => {
      const mockData = {
        kind: 'youtube#liveBroadcastListResponse',
        etag: 'test',
        pageInfo: {
          totalResults: 0,
          resultsPerPage: 5
        },
        items: []
      };
      const expectResult = {
        kind: 'youtube#liveBroadcastListResponse',
        etag: 'test',
        pageInfo: {
          totalResults: 0,
          resultsPerPage: 5
        },
        items: []
      };
      service
        .getBroadcastList('all')
        .subscribe(value => expect(value).toEqual(expectResult));
      const req = http.expectOne({
        method: 'GET',
        url:
          'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=all'
      });
      req.flush(mockData);
    });

    it('should receive broadcast chatId', () => {
      const mockData = {
        kind: 'youtube#liveChatMessageListResponse',
        nextPageToken: 'test',
        pollingIntervalMillis: 500,
        pageInfo: {
          totalResults: 0,
          resultsPerPage: 5
        },
        items: []
      };
      const expectResult = {
        kind: 'youtube#liveChatMessageListResponse',
        nextPageToken: 'test',
        pollingIntervalMillis: 500,
        pageInfo: {
          totalResults: 0,
          resultsPerPage: 5
        },
        items: []
      };

      service.selectBroadcastCat(1);
      expect(service.liveChatId).toBe(1);

      service.getBroadcastChat().subscribe(value => {
        expect(service.pollingIntervalMillis).toBe(500);
        expect(value).toEqual(expectResult);
      });

      const req = http.expectOne({
        method: 'GET',
        url:
          'https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=1&part=snippet'
      });
      req.flush(mockData);
    });
  });
});
