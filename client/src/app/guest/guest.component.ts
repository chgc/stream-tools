import { Component, OnInit } from '@angular/core';
import { HubService } from '../hub.service';
import { CommandModel } from '../command.interface';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  constructor(private hubService: HubService) {}

  ngOnInit() {}

  sendMessage(input) {
    this.hubService.sendCommand(this.buildCommand(input.value));
    input.value = '';
  }

  buildCommand(value) {
    return <CommandModel>{
      command: 'message',
      message: value
    };
  }
}
