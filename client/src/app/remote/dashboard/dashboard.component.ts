import { Component, OnInit } from '@angular/core';
import { ObsService } from '../obs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private obsService: ObsService) {}

  ngOnInit() {
    this.obsService.websocket$.subscribe(msg => console.log(msg));
    this.getList();
  }

  getList() {
    this.obsService.send({ 'request-type': 'GetSceneList' });
  }

  disconnect() {
    this.obsService.disconnect();
  }
}
