import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { BroadcastService } from '../broadcast.service';
import { PrizeDrawService } from '../prize-draw.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TestScheduler } from 'rxjs/testing';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  const broadcastServiceSpy = jasmine.createSpyObj('BroadcastService', [
    'selectBroadcastChat',
    'getBroadcastList',
    'getBroadcastChat',
    'startWatchBroadcastChat',
    'stopWatchBroadcastChat'
  ]);

  const prizeDrawSeriveSpy = jasmine.createSpyObj('PrizeDrawService', [
    'drawWinner',
    'stop',
    'start',
    'saveWinner'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: BroadcastService, useValue: broadcastServiceSpy },
        { provide: PrizeDrawService, useValue: prizeDrawSeriveSpy }
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start watchBroadcastChat', () => {
    broadcastServiceSpy.startWatchBroadcastChat.and.returnValue(of(''));
    component.setLiveChatId(1, 'test');
    expect(broadcastServiceSpy.startWatchBroadcastChat).toHaveBeenCalledWith(
      1,
      'test'
    );
  });

  it('should stop watch broadcast chat', () => {
    component.stop();
    expect(broadcastServiceSpy.stopWatchBroadcastChat).toHaveBeenCalled();
    expect(component.isCapturingMessage).toBeFalsy();
  });

  it('should draw winner', () => {
    component.drawWinner(1, 'item');
    expect(prizeDrawSeriveSpy.drawWinner).toHaveBeenCalledWith(1, 'item');
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
});
