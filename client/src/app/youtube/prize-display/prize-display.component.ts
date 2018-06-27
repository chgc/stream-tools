import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PrizehubService } from '../services/prizehub.service';

@Component({
  selector: 'app-prize-display',
  templateUrl: './prize-display.component.html',
  styleUrls: ['./prize-display.component.css']
})
export class PrizeDisplayComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  gameInfo;
  constructor(
    private prizeHubservice: PrizehubService,
    private route: ActivatedRoute
  ) {}

  receiveNameList(gameInfo) {
    if (gameInfo) {
      this.gameInfo = JSON.parse(gameInfo);
    }
  }

  ngOnInit() {
    const initPrizeHubService = params =>
      this.prizeHubservice.joinRoom(params.get('room'));
    this.prizeHubservice.receiveNameList(this.receiveNameList.bind(this));
    this.prizeHubservice.startListen();

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        tap(initPrizeHubService)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
