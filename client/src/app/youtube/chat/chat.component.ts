import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { BroadcastService } from '../broadcast.service';
import { Observable } from 'rxjs';
import { PrizeDrawService } from '../prize-draw.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  events$: Observable<any> = this.broadcastSerivce.getBroadcastList('active');

  messages$ = this.broadcastSerivce.messages$;
  isStart = false;
  winnerList$ = this.prizeDrawService.nameList$;

  constructor(
    private broadcastSerivce: BroadcastService,
    private prizeDrawService: PrizeDrawService
  ) {}

  ngOnInit() {}

  setLiveChatId(id) {
    this.broadcastSerivce.startWatchBroadcastChat(id).subscribe(() => {
      this.isStart = true;
    });
  }
  stop() {
    this.broadcastSerivce.stopWatchBroadcastChat();
    this.isStart = false;
  }

  mesageTrackByFn(index, item) {
    return item.id;
  }

  startPrizeDraw(keyword) {
    if (!!keyword) {
      console.log(keyword);
      this.prizeDrawService.start(keyword);
    }
  }

  stopPrizeDraw() {
    this.prizeDrawService.stop();
  }

  drawWinner(numberOfWinner) {
    const winner = this.prizeDrawService.drawWinner(numberOfWinner);
    console.log('win', winner);
  }
}
