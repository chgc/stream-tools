import { TestBed, inject } from '@angular/core/testing';

import { PrizeDrawService } from './prize-draw.service';

describe('PrizeDrawService', () => {
  let service: PrizeDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrizeDrawService]
    });
    service = TestBed.get(PrizeDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should random get number of winner', () => {
    spyOn(Math, 'random').and.returnValue(0.3);
    service.nameList = ['1', '2', '3', '4', '5'];
    const result = service.drawWinner(2);
    expect(result).toEqual(['5', '4']);
  });

  it('should random get number of winner', () => {
    spyOn(Math, 'random').and.returnValue(0.6);
    service.nameList = ['1', '2', '3', '4', '5'];
    const result = service.drawWinner(2);
    expect(result).toEqual(['1', '2']);
    expect(service.nameList.length).toBe(5);
  });
});
