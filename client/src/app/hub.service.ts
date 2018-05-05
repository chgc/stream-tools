import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HubService {
  private hubConnection: HubConnection;
  message$ = new Subject();
  constructor() {
    this.hubConnection = new HubConnection(environment.hubUrl);

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this.hubConnection.on('receiveCommand', (receivedMessage: string) => {
      this.message$.next(receivedMessage);
    });
  }

  sendCommand(message: string) {
    this.hubConnection.invoke('sendCommand', message).catch(err => console.error(err));
  }
}
