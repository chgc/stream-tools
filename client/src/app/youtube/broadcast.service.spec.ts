import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { BroadcastService } from './broadcast.service';
import { PrizeDrawService } from './prize-draw.service';

describe('BroadcastService', () => {
  let http: HttpTestingController;
  let service: BroadcastService;

  const authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut']);
  const prizeDrawService = {
    receiveMessage$: new Subject()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BroadcastService,
        {
          provide: AuthService,
          useValue: authServiceSpy
        },
        {
          provide: PrizeDrawService,
          useValue: prizeDrawService
        }
      ]
    }).compileComponents();
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
          'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=all&broadcastType=all'
      });
      req.flush(mockData);
    });

    it('should call LiveBroadcasts list api', () => {
      service.getBroadcastList('all').subscribe(() => {}, null, () => {
        expect(authServiceSpy.signOut).toHaveBeenCalled();
      });
      const req = http.expectOne({
        method: 'GET',
        url:
          'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=all&broadcastType=all'
      });
      req.flush(
        { message: 'my error message' },
        { status: 401, statusText: 'Server error' }
      );
    });
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

    service.startWatchBroadcastChat('1', 'title').subscribe(value => {
      expect(service['liveChatId$'].getValue()).toBe('1');
      expect(service['pollingIntervalMillis$'].getValue()).toBe(500);
      expect(value).toEqual(expectResult);
    });

    const req = http.expectOne({
      method: 'GET',
      url:
        'https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=1&part=authorDetails,snippet'
    });
    req.flush(mockData);
  });

  it(
    'should trigger messages',
    fakeAsync(() => {
      const mockMessage = {
        items: [
          {
            id: 1,
            authorDetails: { displayName: 'Kevin' },
            snippet: { type: 'textMessageEvent', displayMessage: 'test' }
          },
          {
            id: 2,
            authorDetails: { displayName: 'Kevin' },
            snippet: { type: 'superChatEvent', displayMessage: 'test' }
          }
        ]
      };
      spyOn(service, 'queryLiveChat').and.returnValue(of(mockMessage));
      service.messages$.subscribe(message => {
        expect(message).toEqual([
          {
            id: 1,
            displayName: 'Kevin',
            displayMessage: 'test'
          },
          {
            id: 2,
            displayName: 'Kevin',
            displayMessage: 'test'
          }
        ]);
      });

      service['pollingIntervalMillis$'].next(100);
      tick(100);
      discardPeriodicTasks();
    })
  );

  it('should stop watch broadcast chat', () => {
    spyOn(service['stop$'], 'next');
    service.stopWatchBroadcastChat();
    expect(service['stop$'].next).toHaveBeenCalled();
    expect(service.isCapturingMessage.value).toEqual(false);
  });
});
