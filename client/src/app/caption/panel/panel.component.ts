import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, from } from 'rxjs';
import { concatMap, filter, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { CommandModel } from '../services/command.interface';
import { ToolsService } from '../services/tools.service';
import {
  AddCaption,
  GetCaptionList,
  RemoveCaption,
  UpdateCaption
} from '../sotre/caption-items.action';
import {
  GetAreaPosition,
  GetCustomCSS,
  SetAreaPosition,
  SetCustomCSS,
  SetDisplayUrl,
  SetUserID
} from '../sotre/environment.action';

@Component({
  selector: 'app-guest',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  @Select(state => state.captions)
  items$: Observable<any>;

  @Select(state => state.environement.displayUrl)
  displayUrl$;

  customCSS = '';
  areaPosition = {
    MAX_WIDTH: 1620,
    MAX_HEIGHT: 980,
    START_X: 100,
    START_Y: 50
  };

  constructor(
    private authService: AuthService,
    private service: ToolsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.select(state => state.environement).subscribe(caption => {
      this.areaPosition = { ...caption.areaPosition };
      this.customCSS = caption.customCSS;
    });

    this.service.init();

    const joinRoom = userId => this.service.joinRoom(userId);
    const loadData = userId =>
      from([
        new SetUserID(userId),
        new SetDisplayUrl(),
        new GetCaptionList(),
        new GetAreaPosition(),
        new GetCustomCSS()
      ]).pipe(concatMap(action => this.store.dispatch(action)));

    this.authService.authState
      .pipe(
        filter(user => !!user),
        map(user => user.uid),
        tap(joinRoom),
        mergeMap(loadData)
      )
      .subscribe();
  }

  sendMessage(value, colorClass) {
    this.service.sendCommand(this.buildCommand(value, colorClass));
  }

  buildCommand(value, colorClass) {
    return <CommandModel>{
      command: 'message',
      message: value,
      className: `fz${this.getRandomNumber(1, 5)} ${colorClass}`,
      style: {
        left: `${this.getRandomNumber(
          this.areaPosition.START_X,
          this.areaPosition.MAX_WIDTH
        )}px`,
        top: `${this.getRandomNumber(
          this.areaPosition.START_Y,
          this.areaPosition.MAX_HEIGHT
        )}px`,
        transform: `rotate(${this.getRandomNumber(-45, 90)}deg)`
      }
    };
  }

  getRandomNumber(startNumber, maxNumber) {
    return Math.floor(Math.random() * maxNumber) + startNumber;
  }

  addCaption(item) {
    this.store.dispatch(new AddCaption(item));
  }

  saveCaption(item) {
    this.store.dispatch(new UpdateCaption(item));
  }

  removeCaption(item) {
    this.store.dispatch(new RemoveCaption(item.id));
  }

  setAreaPosition() {
    this.store.dispatch(new SetAreaPosition(this.areaPosition));
  }

  setCustomCSS(customCSS) {
    this.store.dispatch(new SetCustomCSS(customCSS));
  }
}
