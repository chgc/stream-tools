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

type broadcastStatus = 'all' | 'active' | 'completed' | 'upcoming';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  liveChatId;
  pollingIntervalMillis$ = new BehaviorSubject<number>(0);
  stop$ = new Subject();

  queryLiveChat$ = this.http
    .get(
      `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${
        this.liveChatId
      }&part=authorDetails,snippet`
    )
    .pipe(
      tap((result: any) => {
        if (
          this.pollingIntervalMillis$.value !== result.pollingIntervalMillis
        ) {
          this.pollingIntervalMillis$.next(result.pollingIntervalMillis);
        }
      })
    );

  messages$ = this.pollingIntervalMillis$.pipe(
    filter(time => time > 0),
    switchMap(time => timer(time, time).pipe(takeUntil(this.stop$))),
    exhaustMap(() =>
      this.queryLiveChat$.pipe(map((result: any) => result.items))
    ),
    mergeMap((messages: any) => from(messages)),
    tap(this.handleMessageAction.bind(this)),
    toArray()
  );

  handleMessageAction(message) {
    if ('textMessageDetails' in message) {
      this.handleTestMessageDetails(message);
    }
    if ('superChatDetails' in message) {
      this.handleSuperChatDetails(message);
    }
  }

  handleTestMessageDetails(message) {}
  handleSuperChatDetails(message) {}

  getBroadcastList(status: broadcastStatus): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=${status}&broadcastType=all`
    );
  }

  startWatchBroadcastChat(id): Observable<any> {
    this.liveChatId = id;
    return this.queryLiveChat$;
  }

  stopWatchBroadcastChat() {
    this.stop$.next();
  }

  constructor(private http: HttpClient) {}
}
