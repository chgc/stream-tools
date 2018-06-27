import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BroadcastService } from '../services/broadcast.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  events$: Observable<any> = this.broadcastSerivce.getBroadcastList('active');
  isCapturingMessage = this.broadcastSerivce.isCapturingMessage;
  eventTitle = this.broadcastSerivce.eventTitle;
  messages$ = this.broadcastSerivce.messages$;
  constructor(private broadcastSerivce: BroadcastService) {}

  setLiveChatId(id, title) {
    this.broadcastSerivce.startWatchBroadcastChat(id, title).subscribe();
  }

  stop() {
    this.broadcastSerivce.stopWatchBroadcastChat();
  }
  mesageTrackByFn(index, item) {
    return item.id;
  }
}
