import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
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
  isEventStart = this.prizeDrawService.isEventStart$;
  gameInfo: GameInfo;
  winnerList$ = this.prizeDrawService.nameList$;
  game = this.fb.group({
    prizes: this.fb.array([])
  });
  eventTitle = this.broadcastSerivce.eventTitle;
  isCapturingMessage = this.broadcastSerivce.isCapturingMessage;

  constructor(
    private broadcastSerivce: BroadcastService,
    private prizeDrawService: PrizeDrawService,
    private fb: FormBuilder
  ) {}

  get prizes() {
    return this.game.get('prizes') as FormArray;
  }

  addPrize() {
    this.prizes.push(this.fb.group({ numberOfWinner: 1, prizeItem: '' }));
  }

  removePrize(idx) {
    this.prizes.removeAt(idx);
  }
  ngOnInit() {
    this.addPrize();
  }

  setLiveChatId(id, title) {
    this.broadcastSerivce.startWatchBroadcastChat(id, title).subscribe();
  }
  stop() {
    this.broadcastSerivce.stopWatchBroadcastChat();
  }

  mesageTrackByFn(index, item) {
    return item.id;
  }

  startPrizeDraw(keyword) {
    if (!!keyword) {
      this.prizeDrawService.start(
        this.broadcastSerivce.eventTitle.getValue(),
        keyword,
        new Date()
      );
      this.gameInfo = this.prizeDrawService.gameInfo;
    }
  }

  stopPrizeDraw() {
    this.prizeDrawService.stop(new Date());
  }

  drawWinner() {
    this.prizes.value.forEach(({ numberOfWinner, prizeItem }) => {
      this.prizeDrawService.drawWinner(numberOfWinner, prizeItem);
    });
  }

  resetResult() {
    this.prizeDrawService.resetWinner();
  }
  saveResult() {
    this.prizeDrawService.saveWinner();
  }
}
