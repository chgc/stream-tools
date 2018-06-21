import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { BroadcastService } from '../broadcast.service';
import { PrizeDrawService } from '../prize-draw.service';
import { of, BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TestScheduler } from 'rxjs/testing';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let broadcastService;
  const broadcastServiceMock = {
    eventTitle: new BehaviorSubject(''),
    selectBroadcastChat: () => {},
    getBroadcastChat: () => {},
    getBroadcastList: () => {},
    startWatchBroadcastChat: () => {},
    stopWatchBroadcastChat: () => {}
  };

  const prizeDrawSeriveSpy = jasmine.createSpyObj('PrizeDrawService', [
    'drawWinner',
    'stop',
    'start',
    'saveWinner',
    'resetWinner'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: BroadcastService, useValue: broadcastServiceMock },
        { provide: PrizeDrawService, useValue: prizeDrawSeriveSpy }
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    broadcastService = TestBed.get(BroadcastService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start watchBroadcastChat', () => {
    spyOn(broadcastService, 'startWatchBroadcastChat').and.returnValue(
      of('event')
    );
    component.setLiveChatId(1, 'test');
    expect(broadcastService.startWatchBroadcastChat).toHaveBeenCalledWith(
      1,
      'test'
    );
  });

  it('should stop watch broadcast chat', () => {
    spyOn(broadcastService, 'stopWatchBroadcastChat');
    component.stop();
    expect(broadcastService.stopWatchBroadcastChat).toHaveBeenCalled();
    expect(component.isCapturingMessage).toBeFalsy();
  });

  it('should draw winner', () => {
    component.addPrize();
    component.drawWinner();
    expect(prizeDrawSeriveSpy.drawWinner).toHaveBeenCalledWith(1, '');
  });

  it('should remove prize', () => {
    component.addPrize();
    component.removePrize(0);
    expect(component.prizes.length).toBe(0);
  });

  it('should stop prize draw', () => {
    component.stopPrizeDraw();
    expect(prizeDrawSeriveSpy.stop).toHaveBeenCalled();
  });

  it('should start prize draw', () => {
    component.startPrizeDraw('keyword');
    expect(prizeDrawSeriveSpy.start).toHaveBeenCalled();
  });

  it('should save result', () => {
    component.saveResult();
    expect(prizeDrawSeriveSpy.saveWinner).toHaveBeenCalled();
  });

  it('should reset winner list', () => {
    component.resetResult();
    expect(prizeDrawSeriveSpy.resetWinner).toHaveBeenCalled();
  });
});
