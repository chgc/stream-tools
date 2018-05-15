import { Component, OnInit } from '@angular/core';
import { HubService } from '../hub.service';
import { CommandModel } from '../command.interface';
import { ToolsService } from '../tools.service';
import { of } from 'rxjs';
export const MAX_WIDTH = 1620;
export const MAX_HEIGHT = 980;
export const START_X = 100;
export const START_Y = 50;

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  buttons$ = of([
    { label: '斗內時間', value: '斗內時間', colorClass: 'btn-danger', style: {} },
    { label: '哈哈哈', value: '哈哈哈', colorClass: 'btn-warning', style: {} },
    { label: '咬我啊', value: '咬我啊', colorClass: 'btn-primary', style: {} },
    { label: '77777777', value: '77777777', colorClass: 'btn-primary', style: { order: 1, color: '#ff0' } },
    { label: '買！都買！', value: '買！都買！', colorClass: 'btn-primary', style: {} },
    { label: '作好！作滿！', value: '作好！作滿！', colorClass: 'btn-primary', style: {} },
    { label: '捐好捐滿', value: '捐好捐滿', colorClass: 'btn-primary', style: {} },
    { label: '推坑', value: '推坑', colorClass: 'btn-warning', style: {} },
    { label: '牛排!!', value: '牛排!!', colorClass: 'btn-warning', style: {} },
    { label: '啊！壞掉了!', value: '啊！壞掉了!', colorClass: 'btn-primary', style: {} },
    { label: '嗶嗶！犯規！', value: '嗶嗶！犯規！', colorClass: 'btn-primary', style: {} },
    { label: '欸～真假啦？！', value: '欸～真假啦？！', colorClass: 'btn-primary', style: {} },
    { label: '人生好累', value: '人生好累', colorClass: 'btn-primary', style: {} },
    { label: 'GG了', value: 'GG了', colorClass: 'btn-primary', style: {} },
    { label: '有必要嗎??', value: '有必要嗎??', colorClass: 'btn-primary', style: {} },
    { label: '幻覺！全都是幻覺', value: '幻覺！全都是幻覺', colorClass: 'btn-primary', style: {} },
    { label: 'LIVE Demo 魔咒發生了！', value: 'LIVE Demo 魔咒發生了！', colorClass: 'btn-warning', style: {} }
  ]);

  constructor(private service: ToolsService) {}

  ngOnInit() {
    this.service.init();
    this.service.joinRoom('amos');
  }

  sendMessage(value) {
    this.service.sendCommand(this.buildCommand(value));
  }

  buildCommand(value) {
    return <CommandModel>{
      command: 'message',
      message: value,
      className: `fz${this.getRandomNumber(1, 5)} r${this.getRandomNumber(1, 5)}`,
      style: {
        left: `${this.getRandomNumber(START_X, MAX_WIDTH)}px`,
        top: `${this.getRandomNumber(START_Y, MAX_HEIGHT)}px`,
        transform: `rotate(${this.getRandomNumber(-45, 90)}deg)`
      }
    };
  }
  getRandomNumber(startNumber, maxNumber) {
    return Math.floor(Math.random() * maxNumber) + startNumber;
  }
}
