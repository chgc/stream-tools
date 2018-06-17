import { Injectable } from '@angular/core';
import { Subject, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import {
  filter,
  map,
  scan,
  takeUntil,
  tap,
  finalize,
  endWith,
  shareReplay,
  startWith
} from 'rxjs/operators';

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

  constructor() {}

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

  drawWinner(numberofWinner: number = 1) {
    this.winners = this.nameList
      .slice()
      .sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
      .splice(0, numberofWinner);
    return this.winners;
  }

  saveWinner() {
    // TODO: Save winner to DB
    console.log(
      this.keyword,
      this.startTime,
      this.endTime,
      this.nameList$.getValue(),
      this.winners
    );
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
