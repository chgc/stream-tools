import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, scan, startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrizeDrawService {
  private nameList = [];
  nameList$ = new BehaviorSubject([]);
  keyword: string;
  startTime: Date;
  endTime: Date;
  winners = [];
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

  start(keyword: string, startTime) {
    this.nameList = [];
    this.startTime = startTime;
    this.keyword = keyword;
    this.nameList$.next([]);
    this.possibleWinnerList$.subscribe(list => (this.nameList = list));
  }

  stop(endDate) {
    this.stop$.next();
    this.endTime = endDate;
  }

  drawWinner(numberofWinner: number = 1, prizeItem: string) {
    this.winners = [
      ...this.winners,
      this.nameList
        .slice()
        .filter(user => this.winners.findIndex(x => x.winner === user) === -1)
        .sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
        .splice(0, numberofWinner)
        .map(winner => ({ winner: winner, prize: prizeItem }))
    ];
    return this.winners;
  }
  resetWinner() {
    this.winners = [];
    return this.winners;
  }
  saveWinner(eventTitle) {
    // TODO: Save winner to DB
    const prizeHistory = {
      eventTitle: eventTitle,
      startTime: this.startTime,
      endTime: this.endTime,
      keyword: this.keyword,
      joinPlayers: this.nameList$.getValue().join(';'),
      prizeDetails: this.winners
    };

    this.http.post('api/prize/create', prizeHistory).subscribe();
  }

  private enableJoinPrizeList(publishedAt, message, author, nameList) {
    return (
      message &&
      message.includes(this.keyword) &&
      !nameList.includes(author) &&
      publishedAt >= this.startTime
    );
  }

  private determineJoinList({ publishedAt, message, author, isChatOwner }) {
    return this.enableJoinPrizeList(publishedAt, message, author, this.nameList)
      ? author
      : '';
  }
}
