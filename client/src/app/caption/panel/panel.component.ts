import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { CaptionService } from '../services/caption.service';
import { CommandModel } from '../services/command.interface';
import { ToolsService } from '../services/tools.service';

@Component({
  selector: 'app-guest',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  // buttons$ = of([
  //   { label: '斗內時間', value: '斗內時間', colorClass: 'btn-danger', style: {} },
  //   { label: '哈哈哈', value: '哈哈哈', colorClass: 'btn-warning', style: {} },
  //   { label: '咬我啊', value: '咬我啊', colorClass: 'btn-primary', style: {} },
  //   { label: '77777777', value: '77777777', colorClass: 'btn-primary', style: { order: 1, color: '#ff0' } },
  //   { label: '買！都買！', value: '買！都買！', colorClass: 'btn-primary', style: {} },
  //   { label: '作好！作滿！', value: '作好！作滿！', colorClass: 'btn-primary', style: {} },
  //   { label: '捐好捐滿', value: '捐好捐滿', colorClass: 'btn-primary', style: {} },
  //   { label: '推坑', value: '推坑', colorClass: 'btn-warning', style: {} },
  //   { label: '牛排!!', value: '牛排!!', colorClass: 'btn-warning', style: {} },
  //   { label: '啊！壞掉了!', value: '啊！壞掉了!', colorClass: 'btn-primary', style: {} },
  //   { label: '嗶嗶！犯規！', value: '嗶嗶！犯規！', colorClass: 'btn-primary', style: {} },
  //   { label: '欸～真假啦？！', value: '欸～真假啦？！', colorClass: 'btn-primary', style: {} },
  //   { label: '人生好累', value: '人生好累', colorClass: 'btn-primary', style: {} },
  //   { label: 'GG了', value: 'GG了', colorClass: 'btn-primary', style: {} },
  //   { label: '有必要嗎??', value: '有必要嗎??', colorClass: 'btn-primary', style: {} },
  //   { label: '幻覺！全都是幻覺', value: '幻覺！全都是幻覺', colorClass: 'btn-primary', style: {} },
  //   { label: 'LIVE Demo 魔咒發生了！', value: 'LIVE Demo 魔咒發生了！', colorClass: 'btn-warning', style: {} }
  // ]);
  buttons$;
  displayUrl;
  customCSS = '';
  areaPosition = {
    MAX_WIDTH: 1620,
    MAX_HEIGHT: 980,
    START_X: 100,
    START_Y: 50
  };

  constructor(
    private authService: AuthService,
    private captionService: CaptionService,
    private service: ToolsService
  ) {}

  ngOnInit() {
    this.service.init();

    const joinRoom = (context, userId) => context.service.joinRoom(userId);
    const setDisplayUrl = (context, userId) =>
      (context.displayUrl = `${location.origin}/main/caption/display/${userId}`);
    const setCaptionsList = (context, userId) => (context.buttons$ = context.captionService.getCaptionList(userId));
    const getEnvironmentVariable = context => userId =>
      forkJoin(context.captionService.getAreaPosition(), context.captionService.getCustomCSS());

    this.authService.authState
      .pipe(
        filter(user => !!user),
        map(user => user.uid),
        tap(userId => {
          joinRoom(this, userId);
          setDisplayUrl(this, userId);
          setCaptionsList(this, userId);
        }),
        mergeMap(getEnvironmentVariable(this))
      )
      .subscribe(([areaPosition, customCss]) => {
        this.areaPosition = areaPosition as any;
        this.customCSS = customCss as string;
      });
  }
  sendMessage(value) {
    this.service.sendCommand(this.buildCommand(value));
  }

  buildCommand(value) {
    return <CommandModel>{
      command: 'message',
      message: value,
      className: `fz${this.getRandomNumber(1, 5)}`,
      style: {
        left: `${this.getRandomNumber(this.areaPosition.START_X, this.areaPosition.MAX_WIDTH)}px`,
        top: `${this.getRandomNumber(this.areaPosition.START_Y, this.areaPosition.MAX_HEIGHT)}px`,
        transform: `rotate(${this.getRandomNumber(-45, 90)}deg)`
      }
    };
  }

  getRandomNumber(startNumber, maxNumber) {
    return Math.floor(Math.random() * maxNumber) + startNumber;
  }

  addCaption(item) {
    this.captionService.createAndUpdateCaption(null, item);
  }

  saveCaption(item) {
    this.captionService.createAndUpdateCaption(item.id, item);
  }

  removeCaption(item) {
    this.captionService.removeCaption(item.id);
  }

  setAreaPosition() {
    this.captionService.setAreaPosition(this.areaPosition);
  }

  setCustomCSS(customCSS) {
    this.captionService.setCustomCSS(customCSS);
  }
}
