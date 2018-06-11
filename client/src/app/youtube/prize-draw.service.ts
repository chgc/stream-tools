import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map, scan, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrizeDrawService {
  nameList = [];
  keyword: string;
  isStart: boolean;

  receiveMessage$ = new Subject();
  determineJoinList$ = this.receiveMessage$.pipe(
    map(this.determineJoinList.bind(this)),
    filter(author => !!author),
    scan((acc, curr) => {
      return [...acc, curr];
    }, [])
  );
  determineJoinListSub: Subscription;

  constructor() {}

  start(keyword: string) {
    this.nameList = [];
    this.keyword = keyword;
    this.determineJoinListSub = this.determineJoinList$.subscribe(
      list => (this.nameList = list)
    );
  }

  stop() {
    this.determineJoinListSub.unsubscribe();
  }

  enableJoinPrizeList(message, author, nameList) {
    return message.includes(this.keyword) && !nameList.includes(author);
  }

  determineJoinList({ message, author }) {
    return this.enableJoinPrizeList(message, author, this.nameList)
      ? author
      : '';
  }

  drawWinner(numberofWinner: number = 1) {
    return this.nameList
      .sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
      .slice()
      .splice(0, numberofWinner);
  }
}
