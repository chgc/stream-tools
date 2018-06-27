import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  @ViewChild('keyword') keyword: ElementRef;
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

  addPrize(numberOfWinner = 1, prizeItem = '') {
    this.prizes.push(this.fb.group({ numberOfWinner, prizeItem }));
  }

  removePrize(idx) {
    this.prizes.removeAt(idx);
  }
  ngOnInit() {
    const prizes = localStorage.getItem('prizes');
    if (prizes) {
      (JSON.parse(prizes) as any[]).forEach(prize =>
        this.addPrize(prize.numberOfWinner, prize.prizeItem)
      );
    } else {
      this.addPrize();
    }
    if (this.prizeDrawService.gameInfo) {
      this.gameInfo = this.prizeDrawService.gameInfo;
      this.keyword.nativeElement.value = this.gameInfo.keyword;
    }
    this.prizes.valueChanges.subscribe(value => {
      localStorage.setItem('prizes', JSON.stringify(value));
    });
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
      this.toggleDrawPirzeList(false);
    }
  }

  toggleDrawPirzeList(enable) {
    this.prizes.controls.forEach((group: FormGroup) => {
      Object.values(group.controls).forEach((control: FormControl) => {
        if (enable) {
          control.enable();
        } else {
          control.disable();
        }
      });
    });
  }

  stopPrizeDraw() {
    this.prizeDrawService.stop(new Date());
    this.toggleDrawPirzeList(true);
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
