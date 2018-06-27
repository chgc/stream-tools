import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeComponent } from './prize.component';
import { PrizeDrawService } from '../prize-draw.service';
import { PrizehubService } from '../prizehub.service';
import { AuthService } from '../../auth.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('PrizeComponent', () => {
  let component: PrizeComponent;
  let fixture: ComponentFixture<PrizeComponent>;
  let prizeDrawService: PrizeDrawService;

  const prizeDrawSeriveSpy = {
    nameList$: of([]),
    drawWinner: () => {},
    stop: () => {},
    start: () => {},
    saveWinner: () => {},
    resetWinner: () => {}
  };

  const prizehubServiceSpy = jasmine.createSpyObj('PrizehubService', [
    'joinRoom',
    'startListen',
    'sendNameList'
  ]);

  const FakeAuthService = {
    authState: of({ uid: 1 })
  } as any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrizeComponent],
      providers: [
        { provide: PrizeDrawService, useValue: prizeDrawSeriveSpy },
        { provide: PrizehubService, useValue: prizehubServiceSpy },
        { provide: AuthService, useValue: FakeAuthService }
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrizeComponent);
    component = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.returnValue(undefined);
    prizeDrawService = TestBed.get(PrizeDrawService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should draw winner', () => {
    spyOn(prizeDrawService, 'drawWinner');
    component.addPrize();
    component.drawWinner();
    expect(prizeDrawService.drawWinner).toHaveBeenCalledWith(1, '');
  });

  it('should remove prize', () => {
    spyOn(prizeDrawService, 'drawWinner');
    component.addPrize();
    component.removePrize(0);
    expect(component.prizes.length).toBe(1);
  });

  it('should stop prize draw', () => {
    spyOn(prizeDrawService, 'stop');
    component.stopPrizeDraw();
    expect(prizeDrawService.stop).toHaveBeenCalled();
  });

  it('should start prize draw', () => {
    spyOn(prizeDrawService, 'start');
    component.startPrizeDraw('keyword');
    expect(prizeDrawService.start).toHaveBeenCalled();
  });

  it('should save result', () => {
    spyOn(prizeDrawService, 'saveWinner');
    component.saveResult();
    expect(prizeDrawService.saveWinner).toHaveBeenCalled();
  });

  it('should reset winner list', () => {
    spyOn(prizeDrawService, 'resetWinner');
    component.resetResult();
    expect(prizeDrawService.resetWinner).toHaveBeenCalled();
  });
});
