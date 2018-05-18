import { Injectable } from '@angular/core';
import { HubService } from './hub.service';
import { Subject, bindCallback } from 'rxjs';
import { CommandModel } from './command.interface';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  message$ = new Subject<CommandModel>();
  private roomName = '';
  constructor(private hubService: HubService) {}

  init() {
    this.addReceiveCommand();
    this.hubService.isStarted$.subscribe(isStart => {
      if (isStart) {
        this.registerToServer();
      }
    });
  }

  joinRoom(roomName) {
    this.roomName = roomName;
  }

  leaveRoom() {
    if (this.roomName.length > 0) {
      this.hubService.invokeCommand('LeaveRoom', this.roomName);
    }
  }

  addReceiveCommand() {
    this.hubService.registerMethods(
      'ReceiveCommand',
      (receivedMessage: string) => {
        this.message$.next(JSON.parse(receivedMessage));
      }
    );
  }

  sendCommand(command) {
    this.hubService.invokeCommand('SendCommand', this.roomName, command);
  }

  private registerToServer() {
    if (this.roomName.length > 0) {
      this.hubService.invokeCommand('JoinRoom', this.roomName);
    }
  }
}
