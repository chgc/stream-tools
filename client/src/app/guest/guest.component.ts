import { Component, OnInit } from '@angular/core';
import { HubService } from '../hub.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  constructor(private hubService: HubService) {}

  ngOnInit() {}

  sendMessage(input) {
    this.hubService.sendCommand(input.value);
    input.value = '';
  }
}
