import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer, empty } from 'rxjs';
import {
  exhaustMap,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  catchError
} from 'rxjs/operators';
import { DisplayMessage } from './models/displayMessage';
import { LiveChatMessage } from './models/liveChatMessage';
import { LiveChatMessageListResponse } from './models/liveChatMessageListResponse';
import { PrizeDrawService } from './prize-draw.service';
import { AuthService } from '../auth.service';

type broadcastStatus = 'all' | 'active' | 'completed' | 'upcoming';

export const YoutubeStreamAPI = {
  liveBroadcastsUrl: status =>
    `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=${status}&broadcastType=all`,
  messagesUrl: id =>
    `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${id}&part=authorDetails,snippet`
};

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private liveChatId$ = new BehaviorSubject<string>('');
  private pollingIntervalMillis$ = new BehaviorSubject<number>(0);
  private stop$ = new Subject();

  isCapturingMessage = new BehaviorSubject(false);
  eventTitle = new BehaviorSubject('');

  messages$ = this.pollingIntervalMillis$.pipe(
    filter(time => time > 0),
    switchMap(time => timer(time, time).pipe(takeUntil(this.stop$))),
    exhaustMap(() => this.queryLiveChat().pipe(map(result => result.items))),
    map(this.processMessages.bind(this))
  );

  startWatchBroadcastChat(
    id: string,
    eventTitle: string
  ): Observable<LiveChatMessageListResponse> {
    this.liveChatId$.next(id);
    this.isCapturingMessage.next(true);
    this.eventTitle.next(eventTitle);
    return this.queryLiveChat();
  }

  stopWatchBroadcastChat() {
    this.stop$.next();
    this.isCapturingMessage.next(false);
  }

  getBroadcastList(status: broadcastStatus): Observable<any> {
    return this.http.get(YoutubeStreamAPI.liveBroadcastsUrl(status)).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.authService.signOut();
        }
        return empty();
      })
    );
  }

  queryLiveChat() {
    return this.http
      .get<LiveChatMessageListResponse>(
        YoutubeStreamAPI.messagesUrl(this.liveChatId$.value)
      )
      .pipe(
        tap(result => {
          const isDiffPollingInterval =
            this.pollingIntervalMillis$.value !== result.pollingIntervalMillis;
          if (isDiffPollingInterval) {
            this.pollingIntervalMillis$.next(result.pollingIntervalMillis);
          }
        })
      );
  }

  private processMessages(messages: LiveChatMessage[]): DisplayMessage[] {
    const chatHandler = message => {
      switch (message.snippet.type) {
        case 'textMessageEvent':
          return this.processTextMessageDetails(message);
        case 'superChatEvent':
          return this.processSuperChatDetails(message);
      }
    };

    const transformMessage = message => ({
      id: message.id,
      displayName: message.authorDetails.displayName,
      displayMessage: message.snippet.displayMessage
    });
    return messages.map(message => transformMessage(chatHandler(message)));
  }

  private processTextMessageDetails(message: LiveChatMessage): LiveChatMessage {
    // console.log('fromTextMessage', message);
    this.prizeDrawService.receiveMessage$.next({
      publishedAt: new Date(message.snippet.publishedAt),
      message: message.snippet.displayMessage,
      author: message.authorDetails.displayName,
      isChatOwner: message.authorDetails.isChatOwner
    });
    return message;
  }
  private processSuperChatDetails(message): LiveChatMessage {
    // console.log('fromSuperChat', message);
    return message;
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private prizeDrawService: PrizeDrawService
  ) {}
}
