import { Component, OnInit } from '@angular/core';
import { HubService } from '../hub.service';
import { CommandModel } from '../command.interface';
import { ToolsService } from '../tools.service';

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
      message: value
    };
  }
}
