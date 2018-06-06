// #region
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AuthService } from '../../auth.service';
import { CaptionService } from '../services/caption.service';
import { ToolsService } from '../services/tools.service';
import {
  AddCaption,
  RemoveCaption,
  UpdateCaption,
  GetCaptionList
} from '../sotre/caption-items.action';
import { CaptionItemsState } from '../sotre/caption-items.state';
import { SetAreaPosition, SetCustomCSS } from '../sotre/environment.action';
import { EnvironmentState } from '../sotre/environment.state';
import { PanelComponent } from './panel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// #endregion

describe('panelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  const FakeAuthService = {
    authState: of({ uid: 1 })
  } as any;

  const fakeToolsService = jasmine.createSpyObj('ToolsService', [
    'init',
    'joinRoom',
    'sendCommand'
  ]);
  const fakeCaptionService = jasmine.createSpyObj('fakeCaptionService', [
    'initFireStore',
    'getCaptionList',
    'getAreaPosition',
    'getCustomCSS'
  ]);
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelComponent],
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([EnvironmentState, CaptionItemsState])
      ],
      providers: [
        { provide: AuthService, useValue: FakeAuthService },
        { provide: ToolsService, useValue: fakeToolsService },
        { provide: CaptionService, useValue: fakeCaptionService }
      ]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fakeCaptionService.getCaptionList.and.returnValue(of([]));
    fakeCaptionService.getAreaPosition.and.returnValue(of([]));
    fakeCaptionService.getCustomCSS.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send a message', () => {
    spyOn(component, 'buildCommand').and.returnValue({});
    component.sendMessage('', '');
    expect(fakeToolsService.sendCommand).toHaveBeenCalled();
  });

  it('should build a command model', () => {
    component.areaPosition = {
      startX: 0,
      startY: 0,
      maxHeight: 0,
      maxWidth: 0
    };
    spyOn(component, 'getRandomNumber').and.callFake(
      (startNumber, maxNumber) => startNumber
    );
    const inputValue = 'test';
    const outputValue = {
      command: 'message',
      message: inputValue,
      className: `fz1 `,
      style: {
        left: `0px`,
        top: `0px`,
        transform: `rotate(-45deg)`
      }
    };
    expect(component.buildCommand(inputValue, '')).toEqual(outputValue);
  });

  it('should return number', () => {
    spyOn(Math, 'random').and.returnValue(0.5);
    expect(component.getRandomNumber(1, 10)).toBe(6);
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

  describe('button Integrated Testing', () => {
    let elements: HTMLElement;
    beforeEach(() => {
      fakeCaptionService.getCaptionList.and.returnValue(
        of([
          {
            label: '斗內時間',
            value: '斗內時間',
            displayClass: 'btn-danger',
            colorClass: 'btn-danger',
            style: {}
          }
        ])
      );
      store.dispatch(new GetCaptionList());

      elements = fixture.debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should render one button', () => {
      const btns = elements.querySelectorAll('button');
      expect(btns.length).toEqual(1);
      const btn = btns[0];
      expect(btn.innerHTML).toContain('斗內時間');
      expect(btn.classList).toContain('btn-danger');
    });

    it('should send message when button click', () => {
      spyOn(component, 'sendMessage');
      const btn = elements.querySelector('button');
      btn.click();
      expect(component.sendMessage).toHaveBeenCalled();
      expect(component.sendMessage).toHaveBeenCalledWith(
        '斗內時間',
        'btn-danger'
      );
    });
  });
});
