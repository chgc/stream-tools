import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ObsService {
  websocket$: WebSocketSubject<any>;
  idCounter = 0;
  isConnect = false;

  constructor(private router: Router) {}

  connect(host, port) {
    this.websocket$ = new WebSocketSubject(`ws://${host}:${port}`);
    this.websocket$.pipe(take(1)).subscribe(
      msg => {
        this.watchErrorEvent();
        this.router.navigate(['remote/dashboard']);
      },
      err => {
        this.redirect();
      }
    );
    this.send({ 'request-type': 'GetVersion' });
  }

  watchErrorEvent() {
    this.websocket$.subscribe(
      () => {},
      event => {
        if (event.type === 'close') {
          this.redirect();
        }
        console.log(event);
      },
      () => {
        this.redirect();
      }
    );
  }
  disconnect() {
    this.websocket$.complete();
  }
  send(message) {
    message['message-id'] = this.nextID();
    if (this.websocket$) {
      this.websocket$.next(message);
    } else {
      this.redirect();
    }
  }

  private redirect() {
    this.router.navigate(['remote']);
  }

  private nextID() {
    return String(this.idCounter++);
  }
}
