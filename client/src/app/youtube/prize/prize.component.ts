import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  Input
} from '@angular/core';
import { PrizehubService } from '../prizehub.service';
import { GameInfo } from '../models/GameInfo';
import { Observable, Subject } from 'rxjs';
import { BroadcastService } from '../broadcast.service';
import { PrizeDrawService } from '../prize-draw.service';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-prize',
  templateUrl: './prize.component.html',
  styleUrls: ['./prize.component.css']
})
export class PrizeComponent implements OnInit, OnDestroy {
  @ViewChild('keyword') keyword: ElementRef;
  @Input() eventTitle: string;
  destroy$ = new Subject();

  isEventStart = this.prizeDrawService.isEventStart$;
  gameInfo: GameInfo;
  displayUrl: string;
  winnerList$ = this.prizeDrawService.nameList$;
  game = this.fb.group({
    prizes: this.fb.array([])
  });

  constructor(
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

  startPrizeDraw(keyword) {
    if (!!keyword) {
      this.prizeDrawService.start(this.eventTitle, keyword, new Date());
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
}
