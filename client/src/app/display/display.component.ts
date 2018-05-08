import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { delay, mergeMap, tap } from 'rxjs/operators';
import { HubService } from '../hub.service';
import { environment } from '../../environments/environment';
import { CommandModel } from '../command.interface';
import { ToolsService } from '../tools.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [style({ opacity: 0 }), stagger(100, [animate('0.5s', style({ opacity: 1 }))])], {
          optional: true
        }),
        query(':leave', [stagger(100, [animate('0.5s', style({ opacity: 0 }))])], {
          optional: true
        })
      ])
    ])
  ]
})
export class DisplayComponent implements OnInit {
  message$ = this.service.message$;
  messages: CommandModel[] = [];
  tasks$ = new Subject<Observable<any>>();
  remover$ = of('').pipe(delay(environment.delayTime), tap(() => this.messages.shift()));

  constructor(private service: ToolsService) {}

  ngOnInit() {
    this.tasks$.pipe(mergeMap(task => task)).subscribe();
    this.message$.subscribe(value => {
      this.messages.push(value);
      this.tasks$.next(this.remover$);
    });
  }
}
