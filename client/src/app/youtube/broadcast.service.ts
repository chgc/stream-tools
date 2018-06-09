import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject, timer } from 'rxjs';
import {
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  toArray
} from 'rxjs/operators';
import { LiveChatMessageListResponse } from './models/liveChatMessageListResponse';
import { DisplayMessage } from './models/displayMessage';
import { LiveChatMessage } from './models/liveChatMessage';

type broadcastStatus = 'all' | 'active' | 'completed' | 'upcoming';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  liveChatId$ = new BehaviorSubject<string>('');
  pollingIntervalMillis$ = new BehaviorSubject<number>(0);
  stop$ = new Subject();

  messages$ = this.pollingIntervalMillis$.pipe(
    filter(time => time > 0),
    switchMap(time => timer(time, time).pipe(takeUntil(this.stop$))),
    exhaustMap(() => this.queryLiveChat().pipe(map(result => result.items))),
    map(this.handleMessageAction.bind(this))
  );

  queryLiveChat() {
    return this.http
      .get<LiveChatMessageListResponse>(
        `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${
          this.liveChatId$.value
        }&part=authorDetails,snippet`
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

  handleMessageAction(messages: LiveChatMessage[]) {
    return messages.map(message => {
      if ('textMessageDetails' in message.snippet) {
        return this.handleTextMessageDetails(message);
      }
      if ('superChatDetails' in message.snippet) {
        return this.handleSuperChatDetails(message);
      }
    });
  }

  handleTextMessageDetails(message: LiveChatMessage): DisplayMessage {
    // console.log('fromTextMessage', message);
    return {
      id: message.id,
      displayName: message.authorDetails.displayName,
      displayMessage: message.snippet.displayMessage
    };
  }
  handleSuperChatDetails(message): DisplayMessage {
    // console.log('fromSuperChat', message);
    return {
      id: message.id,
      displayName: message.authorDetails.displayName,
      displayMessage: message.snippet.displayMessage
    };
  }

  getBroadcastList(status: broadcastStatus): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=${status}&broadcastType=all`
    );
  }

  startWatchBroadcastChat(id: string): Observable<any> {
    this.liveChatId$.next(id);
    return this.queryLiveChat();
  }

  stopWatchBroadcastChat() {
    this.stop$.next();
  }

  constructor(private http: HttpClient) {}
}
