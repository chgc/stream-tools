import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks
} from '@angular/core/testing';
import { of, Subject, Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { DisplayComponent } from './display.component';
import { ToolsService } from '../services/tools.service';
import { ActivatedRoute } from '@angular/router';
import { delay, tap, debounceTime } from 'rxjs/operators';
import { NgxsModule, Store } from '@ngxs/store';
import { EnvironmentState } from '../sotre/environment.state';
import { CaptionItemsState } from '../sotre/caption-items.state';
import { AngularFirestore } from 'angularfire2/firestore';

fdescribe('DisplayComponent', () => {
  let component: DisplayComponent;
  let fixture: ComponentFixture<DisplayComponent>;

  const toolsServiceSpy = {
    joinRoom: id => { },
    init: () => { },
    leaveRoom: () => { },
    message$: new Subject(),
    injectStyle: (value) => { }
  };

  const activedRouteSpy = {
    paramMap: of(new Map<string, string>())
  } as any;

  const FakeAngularFirestore = jasmine.createSpyObj('AngularFirestore', ['doc', 'createId']);

  let store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayComponent],
      imports: [NgxsModule.forRoot([EnvironmentState, CaptionItemsState])],
      providers: [
        { provide: ToolsService, useValue: toolsServiceSpy },
        { provide: ActivatedRoute, useValue: activedRouteSpy },
        { provide: AngularFirestore, useValue: FakeAngularFirestore }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create displayComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should add to meesages', () => {
    component.message$.next({} as any);
    expect(component.messages.length).toBe(1);
  });

  it('should clear out meesages array after 3 sec', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(component.messages.length).toBe(0);
    });

    testScheduler.run(({ cold, expectObservable }) => {
      const input = cold('-a--|');
      input.pipe(tap(v => component.message$.next({} as any)));
      const expected = '-- 2999ms a ---|';
      expectObservable(component.remover$).toBe(expected);
    });
  });
});
