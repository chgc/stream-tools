import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

type broadcastStatus = 'all' | 'active ' | 'completed' | 'upcoming';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  liveChatId;
  pollingIntervalMillis: number;
  constructor(private http: HttpClient) {}

  getBroadcastList(status: broadcastStatus) {
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=${status}`
    );
  }
  selectBroadcastCat(id): any {
    this.liveChatId = id;
  }

  getBroadcastChat(): any {
    if (this.liveChatId) {
      return this.http
        .get(
          `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${
            this.liveChatId
          }&part=snippet`
        )
        .pipe(
          tap(
            (value: any) =>
              (this.pollingIntervalMillis = value.pollingIntervalMillis)
          )
        );
    }
  }
}
