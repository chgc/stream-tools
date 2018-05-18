import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { delay, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommandModel } from '../services/command.interface';
import { ToolsService } from '../services/tools.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  animations: [
    // trigger('listAnimation', [
    //   transition('* => *', [
    //     query(':enter', [style({ opacity: 0 }), stagger(100, [animate('0.5s', style({ opacity: 1 }))])], {
    //       optional: true
    //     }),
    //     query(':leave', [stagger(100, [animate('0.5s', style({ opacity: 0 }))])], {
    //       optional: true
    //     })
    //   ])
    // ])
  ]
})
export class DisplayComponent implements OnInit, OnDestroy {
  message$ = this.service.message$;
  messages: CommandModel[] = [];
  tasks$ = new Subject<Observable<any>>();
  remover$ = of('').pipe(delay(environment.delayTime), tap(() => this.messages.shift()));
  destroy$ = new Subject();

  constructor(private service: ToolsService, private route: ActivatedRoute) {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.service.joinRoom(param.get('room'));
    });
  }

  ngOnInit() {
    this.service.init();
    this.tasks$.pipe(mergeMap(task => task)).subscribe();
    this.message$.pipe(tap(value => this.messages.push({ ...value }))).subscribe(value => {
      this.tasks$.next(this.remover$);
    });
  }

  ngOnDestroy() {
    this.service.leaveRoom();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
