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

  messages$ = null;
  constructor(private broadcastSerivce: BroadcastService) {}

  ngOnInit() {}

  setLiveChatId(id) {
    console.log(id);
    this.broadcastSerivce.selectBroadcastChat(id);
    this.broadcastSerivce
      .getBroadcastChat()
      .subscribe(messages => (this.messages$ = messages));
  }
}
