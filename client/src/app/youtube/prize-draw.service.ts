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

  start(keyword: string) {
    this.nameList = [];
    this.keyword = keyword;
    this.nameList$.next([]);
    this.possibleWinnerList$.subscribe(list => (this.nameList = list));
  }

  stop() {
    this.stop$.next();
  }

  drawWinner(numberofWinner: number = 1) {
    return this.nameList
      .sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
      .slice()
      .splice(0, numberofWinner);
  }

  private enableJoinPrizeList(message, author, nameList) {
    return (
      message && message.includes(this.keyword) && !nameList.includes(author)
    );
  }

  private determineJoinList({ message, author, isChatOwner }) {
    return this.enableJoinPrizeList(message, author, this.nameList)
      ? author
      : '';
  }
}
