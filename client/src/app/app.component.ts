import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private hubConnection: HubConnection;
  nick = '';
  message = '';
  messages: string[] = [];
  ngOnInit() {
    this.nick = window.prompt('Enter your nickname', 'John');

    this.hubConnection = new HubConnection('http://localhost:5000/actionHub');

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this.hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
      const text = `${nick}: ${receivedMessage}`;
      this.messages.push(text);
    });
  }

  sendMessage(): void {
    this.hubConnection.invoke('sendToAll', this.nick, this.message).catch(err => console.error(err));
  }
}
