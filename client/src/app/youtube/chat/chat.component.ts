import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { BroadcastService } from '../broadcast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  events$: Observable<any> = this.broadcastSerivce.getBroadcastList('active');

  messages$ = this.broadcastSerivce.messages$;
  constructor(private broadcastSerivce: BroadcastService) {}

  ngOnInit() {}

  setLiveChatId(id) {
    this.broadcastSerivce.startWatchBroadcastChat(id).subscribe();
  }
  stop() {
    this.broadcastSerivce.stopWatchBroadcastChat();
  }

  mesageTrackByFn(index, item) {
    return item.id;
  }
}
