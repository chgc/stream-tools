import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AceEditorModule } from 'ng2-ace-editor';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelEditComponent } from './panel-edit.component';
import { of } from 'rxjs';
import { Store, NgxsModule } from '@ngxs/store';
import { EnvironmentState } from '../sotre/environment.state';
import { CaptionItemsState } from '../sotre/caption-items.state';
import { AuthService } from '../../auth.service';
import { CaptionService } from '../services/caption.service';

describe('PanelEditComponent', () => {
  let component: PanelEditComponent;
  let fixture: ComponentFixture<PanelEditComponent>;
  const FakeAuthService = {
    authState: of({ uid: 1 })
  } as any;

  const fakeCaptionService = jasmine.createSpyObj('fakeCaptionService', [
    'initFireStore',
    'getCaptionList'
  ]);
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelEditComponent],
      imports: [
        ReactiveFormsModule,
        AceEditorModule,
        NgxsModule.forRoot([EnvironmentState, CaptionItemsState])
      ],
      providers: [
        { provide: AuthService, useValue: FakeAuthService },
        { provide: CaptionService, useValue: fakeCaptionService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
