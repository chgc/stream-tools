import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PrizeDrawService } from './prize-draw.service';
import { GameInfo } from './models/GameInfo';

describe('PrizeDrawService', () => {
  let service: PrizeDrawService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrizeDrawService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(PrizeDrawService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should random get number of winner', () => {
    spyOn(Math, 'random').and.returnValue(0.3);
    service.gameInfo = <GameInfo>{
      nameList: ['1', '2', '3', '4', '5'],
      winners: []
    };
    const result = service.drawWinner(2, 'event');
    expect(service.gameInfo.winners).toEqual([
      { winner: '5', prize: 'event' },
      { winner: '4', prize: 'event' }
    ]);
  });

  it('should random get number of winner', () => {
    spyOn(Math, 'random').and.returnValue(0.6);
    service.gameInfo = <GameInfo>{
      nameList: ['1', '2', '3', '4', '5'],
      winners: [{ winner: '2', prize: 'event' }]
    };
    service.drawWinner(2, 'event');
    expect(service.gameInfo.winners).toEqual([
      { winner: '2', prize: 'event' },
      { winner: '1', prize: 'event' },
      { winner: '3', prize: 'event' }
    ]);
    expect(service.gameInfo.winners.length).toBe(3);
  });

  describe('game start', () => {
    it('should start game', () => {
      const today = new Date('2017-01-01T00:00:00');
      spyOn(service, 'resetGame');
      spyOn(service['possibleWinnerList$'], 'subscribe');
      service.start('event', 'keyword', today);
      expect(service['resetGame']).toHaveBeenCalled();
      expect(service.isEventStart).toBeTruthy();
      expect(service['possibleWinnerList$'].subscribe).toHaveBeenCalled();
    });

    it('should catch possibleWinner', () => {
      const today = new Date('2017-01-01T00:00:00');
      const mockMessage = {
        publishedAt: today,
        message: 'test',
        author: 'tester',
        isChatOwner: false
      };
      service.start('event', 'test', today);
      expect(service.gameInfo.nameList).toEqual([]);
      service.receiveMessage$.next(mockMessage);
      expect(service.gameInfo.nameList).toEqual(['tester']);
    });
  });

  it('should stop prize draw', () => {
    const today = new Date('2017-01-01T00:00:00');
    service.start('event', 'keyword', today);
    service.stop(today);
    expect(service.isEventStart).toBeFalsy();
    expect(service.gameInfo.endTime).toEqual(today);
  });

  it('should reset winner list', () => {
    service.gameInfo = <GameInfo>{
      winners: [{ winner: '1', prize: 'prizeItem' }]
    };
    service.resetWinner();
    expect(service.gameInfo.winners.length).toBe(0);
  });

  it('should save winner to db', () => {
    const today = new Date('2017-01-01T00:00:00');
    service.gameInfo = {
      startTime: today,
      endTime: today,
      eventTitle: 'event',
      keyword: 'keyword',
      winners: [],
      nameList: []
    };
    const expectResult = {
      eventTitle: 'event',
      startTime: today,
      endTime: today,
      keyword: 'keyword',
      joinPlayers: '',
      prizeDetails: []
    };

    service.saveWinner();
    const req = http.expectOne({
      method: 'POST',
      url: 'api/prize/create'
    });

    expect(req.request.body).toEqual(expectResult);
  });
});
