import { Injectable } from '@angular/core';
import { HubService } from '../caption/services/hub.service';

@Injectable({
  providedIn: 'root'
})
export class PrizehubService {
  private roomName = '';
  constructor(private hubService: HubService) {}

  startListen() {
    this.hubService.isStarted$.subscribe(isStart => {
      if (isStart) {
        this.registerToServer();
      }
    });
  }
  sendNameList(gameInfo) {
    this.hubService.invokeCommand('SendNameList', this.roomName, gameInfo);
  }

  receiveNameList(callback) {
    this.hubService.registerMethods('ReceiveNameList', callback);
  }

  joinRoom(roomName) {
    this.roomName = roomName;
  }

  leaveRoom() {
    if (this.roomName.length > 0) {
      this.hubService.invokeCommand('LeaveRoom', this.roomName);
    }
  }

  private registerToServer() {
    if (this.roomName.length > 0) {
      this.hubService.invokeCommand('JoinRoom', this.roomName);
    }
  }
}
