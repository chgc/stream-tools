import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { delay, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommandModel } from '../services/command.interface';
import { ToolsService } from '../services/tools.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, OnDestroy {
  message$ = this.service.message$;
  messages: CommandModel[] = [];
  tasks$ = new Subject<Observable<any>>();
  remover$ = of('').pipe(
    delay(environment.delayTime),
    tap(() => this.messages.shift())
  );
  destroy$ = new Subject();

  constructor(private service: ToolsService, private route: ActivatedRoute, private store: Store) {
    this.store.selectOnce(state => state.customCSS).subscribe(value => this.service.injectStyle(value));
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.service.joinRoom(param.get('room'));
    });
  }

  ngOnInit() {
    this.service.init();
    this.tasks$.pipe(mergeMap(task => task)).subscribe();
    this.message$
      .pipe(tap(value => this.messages.push({ ...value })))
      .subscribe(value => {
        this.tasks$.next(this.remover$);
      });
  }

  ngOnDestroy() {
    this.service.leaveRoom();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
