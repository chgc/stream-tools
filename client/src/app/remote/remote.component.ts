import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ObsService } from './obs.service';

@Component({
  selector: 'app-remote',
  templateUrl: './remote.component.html',
  styleUrls: ['./remote.component.css']
})
export class RemoteComponent implements OnDestroy {
  server = this.fb.group({
    host: ['localhost'],
    port: ['4444']
  });

  constructor(private fb: FormBuilder, title: Title, private obsService: ObsService) {
    title.setTitle('OBS後臺管理');
  }

  connect() {
    const host = this.server.value.host;
    const port = this.server.value.port;
    this.obsService.connect(host, port);
  }

  ngOnDestroy(): void {
    this.obsService.disconnect();
  }
}
