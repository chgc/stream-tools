import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';
import { CommandModel } from './command.interface';
@Injectable({
  providedIn: 'root'
})
export class HubService {
  private hubConnection: HubConnection;
  message$ = new Subject<CommandModel>();
  constructor() {
    this.hubConnection = new HubConnection(environment.hubUrl);

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this.hubConnection.on('receiveCommand', (receivedMessage: string) => {
      this.message$.next(JSON.parse(receivedMessage));
    });
  }

  sendCommand(command: CommandModel) {
    this.hubConnection.invoke('sendCommand', command).catch(err => console.error(err));
  }
}
