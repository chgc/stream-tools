import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import {
  exhaustMap,
  filter,
  map,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { DisplayMessage } from './models/displayMessage';
import { LiveChatMessage } from './models/liveChatMessage';
import { LiveChatMessageListResponse } from './models/liveChatMessageListResponse';
import { PrizeDrawService } from './prize-draw.service';

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

  messages$ = this.pollingIntervalMillis$.pipe(
    filter(time => time > 0),
    switchMap(time => timer(time, time).pipe(takeUntil(this.stop$))),
    exhaustMap(() => this.queryLiveChat().pipe(map(result => result.items))),
    map(this.handleMessageAction.bind(this))
  );

  startWatchBroadcastChat(id: string): Observable<LiveChatMessageListResponse> {
    this.liveChatId$.next(id);
    return this.queryLiveChat();
  }

  stopWatchBroadcastChat() {
    this.stop$.next();
  }

  getBroadcastList(status: broadcastStatus): Observable<any> {
    return this.http.get(YoutubeStreamAPI.liveBroadcastsUrl(status));
  }

  private queryLiveChat() {
    return this.http
      .get<LiveChatMessageListResponse>(
        YoutubeStreamAPI.messagesUrl(this.liveChatId$.value)
      )
      .pipe(
        tap(result => {
          if (
            this.pollingIntervalMillis$.value !== result.pollingIntervalMillis
          ) {
            this.pollingIntervalMillis$.next(result.pollingIntervalMillis);
          }
        })
      );
  }

  private handleMessageAction(messages: LiveChatMessage[]) {
    return messages.map(message => {
      if ('textMessageDetails' in message.snippet) {
        return this.handleTextMessageDetails(message);
      }
      if ('superChatDetails' in message.snippet) {
        return this.handleSuperChatDetails(message);
      }
    });
  }

  private handleTextMessageDetails(message: LiveChatMessage): DisplayMessage {
    // console.log('fromTextMessage', message);
    this.prizeDrawService.receiveMessage$.next({
      message: message.snippet.displayMessage,
      author: message.authorDetails.displayName
    });
    return {
      id: message.id,
      displayName: message.authorDetails.displayName,
      displayMessage: message.snippet.displayMessage
    };
  }
  private handleSuperChatDetails(message): DisplayMessage {
    // console.log('fromSuperChat', message);
    return {
      id: message.id,
      displayName: message.authorDetails.displayName,
      displayMessage: message.snippet.displayMessage
    };
  }

  constructor(
    private http: HttpClient,
    private prizeDrawService: PrizeDrawService
  ) {}
}
