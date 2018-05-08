import { Component, OnInit } from '@angular/core';
import { HubService } from '../hub.service';
import { CommandModel } from '../command.interface';
import { ToolsService } from '../tools.service';

export const MAX_WIDTH = 1000;
export const MAX_HEIGHT = 500;
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

  sendMessage(input) {
    this.service.sendCommand(this.buildCommand(input.value));
    input.value = '';
  }

  buildCommand(value) {
    return <CommandModel>{
      command: 'message',
      message: value,
      style: {
        left: `${this.getRandomNumber(START_X, MAX_WIDTH)}px`,
        top: `${this.getRandomNumber(START_Y, MAX_HEIGHT)}px`
      }
    };
  }
  getRandomNumber(startNumber, maxNumber) {
    return Math.floor(Math.random() * maxNumber) + startNumber;
  }
}
