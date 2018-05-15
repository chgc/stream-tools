import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  private hubConnection: HubConnection;
  isStarted$ = new BehaviorSubject<boolean>(false);
  constructor() {
    this.hubConnection = new HubConnectionBuilder().withUrl(environment.hubUrl).build();
    this.start();
    this.hubConnection.onclose(() => this.start());
  }

  start() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started!');
        this.isStarted$.next(true);
      })
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
