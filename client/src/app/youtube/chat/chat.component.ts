import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BroadcastService } from '../broadcast.service';
import { GameInfo } from '../models/GameInfo';
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
  eventTitle = '';
  isEventStart = false;
  gameInfo: GameInfo;
  winnerList$ = this.prizeDrawService.nameList$;

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
      this.prizeDrawService.start(this.eventTitle, keyword, new Date());
      this.isEventStart = true;
      this.gameInfo = this.prizeDrawService.gameInfo;
    }
  }

  stopPrizeDraw() {
    this.isEventStart = false;
    this.prizeDrawService.stop(new Date());
  }

  drawWinner(numberOfWinner, prizeItem) {
    this.prizeDrawService.drawWinner(numberOfWinner, prizeItem);
    console.log('win', this.gameInfo.winners);
  }

  resetResult() {
    this.prizeDrawService.resetWinner();
  }
  saveResult() {
    this.prizeDrawService.saveWinner(this.eventTitle);
  }
}
