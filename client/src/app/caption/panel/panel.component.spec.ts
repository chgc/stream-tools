import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth.service';
import { ToolsService } from '../services/tools.service';
import { EnvironmentState } from '../sotre/environment.state';
import { PanelComponent } from './panel.component';
import { CaptionItemsState } from '../sotre/caption-items.state';
import { CaptionService } from '../services/caption.service';

export class FakeAuthService {
  authState = new Subject();
}

describe('panelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  const fakeToolsService = jasmine.createSpyObj('ToolsService', [
    'init',
    'joinRoom'
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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
