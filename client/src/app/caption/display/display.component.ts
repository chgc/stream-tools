import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import {
  delay,
  mergeMap,
  takeUntil,
  tap,
  map,
  take,
  filter,
  distinctUntilChanged
} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommandModel } from '../services/command.interface';
import { ToolsService } from '../services/tools.service';
import { Store } from '@ngxs/store';
import { GetCustomCSS, SetUserID } from '../sotre/environment.action';

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

  constructor(
    private service: ToolsService,
    private route: ActivatedRoute,
    private store: Store
  ) {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.service.joinRoom(param.get('room'));
      this.store.dispatch(new SetUserID(param.get('room')));
      this.store.dispatch(new GetCustomCSS(param.get('room')));
    });
  }

  ngOnInit() {
    this.injectStyle();
    this.service.init();
    this.tasks$.pipe(mergeMap(task => task)).subscribe();
    this.message$
      .pipe(
        tap(v => console.log(v)),
        tap(value => this.messages.push({ ...value }))
      )
      .subscribe(value => {
        this.tasks$.next(this.remover$);
      });
  }

  injectStyle() {
    this.store
      .select(state => state.environement)
      .pipe(
        filter(env => env.customCSS),
        map(env => env.customCSS),
        distinctUntilChanged()
      )
      .subscribe(customCSS => this.injectCustomStyle(customCSS));
  }
  ngOnDestroy() {
    this.service.leaveRoom();
    this.destroy$.next();
    this.destroy$.complete();
  }

  injectCustomStyle(cssSylte) {
    const customStyleDOM = document.querySelector('style[title="custom"]');
    if (customStyleDOM) {
      customStyleDOM.remove();
    }
    const script = document.createElement('style');
    script.type = 'text/css';
    script.title = 'custom';
    script.appendChild(document.createTextNode(cssSylte));
    document.body.appendChild(script);
  }
}
