import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  private hubConnection: HubConnection;
  constructor() {
    this.hubConnection = new HubConnection(environment.hubUrl);
    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));
  }

  registerMethods(methodName, callback) {
    this.hubConnection.on(methodName, callback);
  }

  unregisterMethods(methodName) {
    this.hubConnection.off(methodName);
  }

  invokeCommand(methodName, ...args) {
    this.hubConnection.invoke(methodName, ...args).catch(err => console.error(err));
  }
}
