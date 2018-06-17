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
  isCapturingMessage = false;
  keyword = '';
  eventTitle = '';
  isEventStart = false;
  startTime: Date;
  endTime: Date;
  winnerList$ = this.prizeDrawService.nameList$;
  winners = [];

  constructor(
    private broadcastSerivce: BroadcastService,
    private prizeDrawService: PrizeDrawService
  ) {}

  ngOnInit() {}

  setLiveChatId(id, title) {
    this.broadcastSerivce.startWatchBroadcastChat(id).subscribe(() => {
      this.isCapturingMessage = true;
      this.eventTitle = title;
    });
  }
  stop() {
    this.broadcastSerivce.stopWatchBroadcastChat();
    this.isCapturingMessage = false;
  }

  mesageTrackByFn(index, item) {
    return item.id;
  }

  startPrizeDraw(keyword) {
    if (!!keyword) {
      this.keyword = keyword;
      this.isEventStart = true;
      this.startTime = new Date();
      this.endTime = undefined;
      this.prizeDrawService.start(keyword, this.startTime);
    }
  }

  stopPrizeDraw() {
    this.isEventStart = false;
    this.endTime = new Date();
    this.prizeDrawService.stop(this.endTime);
  }

  drawWinner(numberOfWinner, prizeItem) {
    this.winners = this.prizeDrawService.drawWinner(numberOfWinner, prizeItem);
    console.log('win', this.winners);
  }

  saveResult() {
    this.prizeDrawService.saveWinner(this.eventTitle);
  }
}
