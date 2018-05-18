import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AuthService } from '../../auth.service';
import { ToolsService } from '../services/tools.service';
import { EnvironmentState } from '../sotre/environment.state';
import { PanelComponent } from './panel.component';
import { CaptionItemsState } from '../sotre/caption-items.state';
import { CaptionService } from '../services/caption.service';
import { Command } from 'selenium-webdriver';
import {
  AddCaption,
  UpdateCaption,
  RemoveCaption
} from '../sotre/caption-items.action';
import { SetCustomCSS, SetAreaPosition } from '../sotre/environment.action';

export class FakeAuthService {
  authState = of({ uid: 123 });
}

describe('panelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  const fakeToolsService = jasmine.createSpyObj('ToolsService', [
    'init',
    'joinRoom',
    'sendCommand'
  ]);
  const fakeCaptionService = jasmine.createSpyObj('fakeCaptionService', [
    'initFireStore'
  ]);
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelComponent],
      imports: [NgxsModule.forRoot([EnvironmentState, CaptionItemsState])],
      providers: [
        { provide: AuthService, useClass: FakeAuthService },
        { provide: ToolsService, useValue: fakeToolsService },
        { provide: CaptionService, useValue: fakeCaptionService }
      ]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send a message', () => {
    spyOn(component, 'buildCommand').and.returnValue({});
    component.sendMessage('');
    expect(fakeToolsService.sendCommand).toHaveBeenCalled();
  });

  it('should build a command model', () => {
    component.areaPosition = {
      START_X: 0,
      START_Y: 0,
      MAX_HEIGHT: 0,
      MAX_WIDTH: 0
    };
    spyOn(component, 'getRandomNumber').and.callFake(
      (startNumber, maxNumber) => startNumber
    );
    const inputValue = 'test';
    const outputValue = {
      command: 'message',
      message: inputValue,
      className: `fz1`,
      style: {
        left: `0px`,
        top: `0px`,
        transform: `rotate(-45deg)`
      }
    };
    expect(component.buildCommand(inputValue)).toEqual(outputValue);
  });

  it('should return number', () => {
    expect(component.getRandomNumber(0, 0)).toBe(0);
  });

  it('should dispatch AddCaption', () => {
    const item = {};
    spyOn(store, 'dispatch');
    component.addCaption(item);
    expect(store.dispatch).toHaveBeenCalledWith(new AddCaption(item));
  });

  it('should dispatch saveCaption', () => {
    const item = {};
    spyOn(store, 'dispatch');
    component.saveCaption(item);
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateCaption(item));
  });

  it('should dispatch removeCaption', () => {
    const item = { id: 1 };
    spyOn(store, 'dispatch');
    component.removeCaption(item);
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveCaption(1));
  });

  it('should dispatch setAreaPosition', () => {
    spyOn(store, 'dispatch');
    component.setAreaPosition();
    expect(store.dispatch).toHaveBeenCalledWith(
      new SetAreaPosition(component.areaPosition)
    );
  });

  it('should dispatch setAreaPosition', () => {
    const customCSS = '';
    spyOn(store, 'dispatch');
    component.setCustomCSS(customCSS);
    expect(store.dispatch).toHaveBeenCalledWith(new SetCustomCSS(customCSS));
  });
});
