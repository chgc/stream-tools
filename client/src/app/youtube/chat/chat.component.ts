import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { BroadcastService } from '../broadcast.service';
import { GameInfo } from '../models/GameInfo';
import { PrizeDrawService } from '../prize-draw.service';
import { AuthService } from '../../auth.service';
import { ToolsService } from '../../caption/services/tools.service';
import { PrizehubService } from '../prizehub.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('keyword') keyword: ElementRef;
  events$: Observable<any> = this.broadcastSerivce.getBroadcastList('active');
  destroy$ = new Subject();
  messages$ = this.broadcastSerivce.messages$;
  isEventStart = this.prizeDrawService.isEventStart$;
  displayUrl;
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
    private authService: AuthService,
    private prizeHubservice: PrizehubService,
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

  test() {
    this.prizeHubservice.sendNameList({
      eventTitle: 'test',
      keyword: 'keyword',
      startTime: new Date(),
      endTime: new Date(),
      winners: [
        {
          winner: 'Kevin Yang',
          prize: '簽名照'
        }
      ],
      nameList: ['Kevin Yang']
    });
  }

  ngOnInit() {
    this.preparePrizeDisplay();
    this.restorePrizes();
    this.restoreGameInfo();
    this.prizes.valueChanges.subscribe(value => {
      localStorage.setItem('prizes', JSON.stringify(value));
    });

    this.prizeDrawService.nameList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        if (this.prizeDrawService.gameInfo) {
          this.prizeHubservice.sendNameList({
            ...this.prizeDrawService.gameInfo,
            namelist: list
          });
        }
      });
  }

  private preparePrizeDisplay() {
    this.authService.authState.subscribe(user => {
      if (user) {
        this.displayUrl = `${location.origin}/main/youtube/prizeDisplay/${
          user.uid
        }`;
        this.prizeHubservice.joinRoom(user.uid);
        this.prizeHubservice.startListen();
      }
    });
  }

  private restorePrizes() {
    const prizes =
      localStorage.getItem('prizes') ||
      '[{"numberOfWinner": 1, "prizeItem":""}]';
    (JSON.parse(prizes) as any[]).forEach(prize =>
      this.addPrize(prize.numberOfWinner, prize.prizeItem)
    );
  }

  private restoreGameInfo() {
    if (this.prizeDrawService.gameInfo) {
      this.gameInfo = this.prizeDrawService.gameInfo;
      this.keyword.nativeElement.value = this.gameInfo.keyword;
    }
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
      this.prizeHubservice.sendNameList(this.prizeDrawService.gameInfo);
    });
  }

  resetResult() {
    this.prizeDrawService.resetWinner();
  }

  saveResult() {
    this.prizeDrawService.saveWinner();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
