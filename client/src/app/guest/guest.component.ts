import { Component, OnInit } from '@angular/core';
import { HubService } from '../hub.service';
import { CommandModel } from '../command.interface';
import { ToolsService } from '../tools.service';

export const MAX_WIDTH = 1920;
export const MAX_HEIGHT = 1080;
export const START_X = 0;
export const START_Y = 0;

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  constructor(private service: ToolsService) {}

  ngOnInit() {}

  sendMessage(value) {
    this.service.sendCommand(this.buildCommand(value));
  }

  buildCommand(value) {
    return <CommandModel>{
      command: 'message',
      message: value,
      className: `fz${this.getRandomNumber(1, 5)} r${this.getRandomNumber(1, 5)}`,
      style: {
        left: `${this.getRandomNumber(START_X, MAX_WIDTH)}px`,
        top: `${this.getRandomNumber(START_Y, MAX_HEIGHT)}px`,
        transform: `rotate(${this.getRandomNumber(-45, 90)}deg)`
      }
    };
  }
  getRandomNumber(startNumber, maxNumber) {
    return Math.floor(Math.random() * maxNumber) + startNumber;
  }
}
