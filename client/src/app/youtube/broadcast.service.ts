import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

type broadcastStatus = 'all' | 'active' | 'completed' | 'upcoming';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  liveChatId;
  pollingIntervalMillis: number;
  constructor(private http: HttpClient) {}

  getBroadcastList(status: broadcastStatus): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=${status}&broadcastType=all`
    );
  }
  selectBroadcastChat(id): any {
    this.liveChatId = id;
  }

  getBroadcastChat(): Observable<any> {
    if (this.liveChatId) {
      return this.http
        .get(
          `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${
            this.liveChatId
          }&part=authorDetails,snippet`
        )
        .pipe(
          tap(
            (value: any) =>
              (this.pollingIntervalMillis = value.pollingIntervalMillis)
          )
        );
    }
    return of([]);
  }
}
