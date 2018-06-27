import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { BroadcastService } from '../broadcast.service';
import { ChatComponent } from './chat.component';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        { provide: BroadcastService, useValue: broadcastServiceMock }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    broadcastService = TestBed.get(BroadcastService);

    spyOn(localStorage, 'getItem').and.returnValue(undefined);

    fixture.detectChanges();
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
});
