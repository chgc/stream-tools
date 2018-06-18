import { GameInfo } from './models/GameInfo';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, scan, startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrizeDrawService {
  nameList$ = new BehaviorSubject([]);
  gameInfo: GameInfo;
  isEventStart: boolean;
  receiveMessage$ = new Subject();
  private stop$ = new Subject();
  private possibleWinnerList$ = this.receiveMessage$.pipe(
    startWith([]),
    takeUntil(this.stop$),
    map(this.determineJoinList.bind(this)),
    filter(author => !!author),
    scan((acc, curr: string) => {
      return curr.length === 0 ? [] : [...acc, curr];
    }, []),
    tap(list => this.nameList$.next(list))
  );

  constructor(private http: HttpClient) {}

  start(eventTitle: string, keyword: string, startTime) {
    this.resetGame(eventTitle, keyword, startTime);
    this.isEventStart = true;
    this.possibleWinnerList$.subscribe(list => (this.gameInfo.nameList = list));
  }

  stop(endDate) {
    this.stop$.next();
    this.isEventStart = false;
    this.gameInfo.endTime = endDate;
  }

  drawWinner(numberofWinner: number = 1, prizeItem: string): void {
    const drawRandomWinner = this.gameInfo.nameList
      .slice()
      .filter(
        user => this.gameInfo.winners.findIndex(x => x.winner === user) === -1
      )
      .sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
      .splice(0, numberofWinner)
      .map(winner => ({ winner: winner, prize: prizeItem }));

    this.gameInfo.winners = [...this.gameInfo.winners, ...drawRandomWinner];
  }
  resetWinner(): void {
    this.gameInfo.winners = [];
  }
  saveWinner(eventTitle) {
    // TODO: Save winner to DB
    const prizeHistory = {
      eventTitle: eventTitle,
      startTime: this.gameInfo.startTime,
      endTime: this.gameInfo.endTime,
      keyword: this.gameInfo.keyword,
      joinPlayers: this.gameInfo.nameList.join(';'),
      prizeDetails: this.gameInfo.winners
    };

    this.http.post('api/prize/create', prizeHistory).subscribe();
  }

  private resetGame(eventTitle, keyword, startTime) {
    this.gameInfo = {
      eventTitle: eventTitle,
      keyword: keyword,
      startTime: startTime,
      endTime: undefined,
      winners: [],
      nameList: []
    };
    this.nameList$.next([]);
  }
  private enableJoinPrizeList(
    publishedAt,
    message,
    author,
    gameInfo: GameInfo
  ) {
    return (
      message &&
      message.includes(gameInfo.keyword) &&
      !gameInfo.nameList.includes(author) &&
      publishedAt >= gameInfo.startTime
    );
  }

  private determineJoinList({ publishedAt, message, author, isChatOwner }) {
    return this.enableJoinPrizeList(publishedAt, message, author, this.gameInfo)
      ? author
      : '';
  }
}
