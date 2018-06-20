import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { BroadcastService } from '../broadcast.service';
import { PrizeDrawService } from '../prize-draw.service';
import { of } from 'rxjs';

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

  const prizeDrawSeriveSpy = jasmine.createSpyObj('PrizeDrawService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: BroadcastService, useValue: broadcastServiceSpy },
        { provide: PrizeDrawService, useValue: prizeDrawSeriveSpy }
      ]
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
    expect(broadcastServiceSpy.startWatchBroadcastChat).toHaveBeenCalledWith(1);
    expect(component.isCapturingMessage).toBeTruthy();
    expect(component.eventTitle).toEqual('test');
  });

  it('should stop watch broadcast chat', () => {
    component.stop();
    expect(broadcastServiceSpy.stopWatchBroadcastChat).toHaveBeenCalled();
    expect(component.isCapturingMessage).toBeFalsy();
  });
});
