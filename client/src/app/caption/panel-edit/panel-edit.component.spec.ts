import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { AceEditorModule } from 'ng2-ace-editor';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelEditComponent } from './panel-edit.component';
import { of } from 'rxjs';
import { Store, NgxsModule } from '@ngxs/store';
import { EnvironmentState } from '../sotre/environment.state';
import { CaptionItemsState } from '../sotre/caption-items.state';
import { AuthService } from '../../auth.service';
import { CaptionService } from '../services/caption.service';
import { SetAreaPosition, SetCustomCSS } from '../sotre/environment.action';
import {
  RemoveCaption,
  AddCaption,
  UpdateCaption
} from '../sotre/caption-items.action';

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
    store = TestBed.get(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset areaPositionGroup form value', () => {
    spyOn(store, 'selectOnce').and.returnValue(of({ areaPosition: {} }));
    spyOn(component.areaPositionGroup, 'reset');
    component.resetValue();
    expect(component.areaPositionGroup.reset).toHaveBeenCalledWith(
      {},
      { emitEvent: false }
    );
  });

  it('should reset customCSSGroup form value', () => {
    spyOn(store, 'selectOnce').and.returnValue(of({ customCSS: 'h1{}' }));
    spyOn(component.customCSSGroup, 'reset');
    component.resetValue();
    expect(component.customCSSGroup.reset).toHaveBeenCalledWith(
      { customCSS: 'h1{}' },
      { emitEvent: false }
    );
  });

  it(
    'should dispatch SetAreaPosition when areaPositionGroup Valuchange',
    fakeAsync(() => {
      spyOn(store, 'dispatch');
      component.areaPositionGroup.patchValue({});
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(
        new SetAreaPosition({
          maxWidth: 0,
          maxHeight: 0,
          startX: 0,
          startY: 0
        })
      );
    })
  );

  it(
    'should dispatch SetCustomCSS when customCSSGroup Valuchange',
    fakeAsync(() => {
      spyOn(store, 'dispatch');
      component.customCSSGroup.patchValue({ customCSS: 'h1{}' });
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(new SetCustomCSS('h1{}'));
    })
  );

  describe('editGroups', () => {
    it('should setFormGroup when style is not empty', () => {
      spyOn(component.stop$, 'next');
      spyOn(component.editGroups, 'reset');
      const mockCaption = { label: 'test', style: '{ order: 1 }' };
      const mockResult = { label: 'test', style: '{ order: 1 }' };
      component.setFormGroup(mockCaption);
      expect(component.editGroups.reset).toHaveBeenCalledWith(mockResult);
    });

    it('should setFormGroup when style is empty', () => {
      spyOn(component.stop$, 'next');
      spyOn(component.editGroups, 'reset');
      spyOn(component, 'save');
      const mockCaption = { label: 'test' };
      const mockResult = { label: 'test', style: undefined };
      component.setFormGroup(mockCaption);
      expect(component.editGroups.reset).toHaveBeenCalledWith(mockResult);
    });

    it(
      'should trigger save whe setFormGroup',
      fakeAsync(() => {
        spyOn(component.stop$, 'next');
        spyOn(component, 'save');
        const mockCaption = { label: 'test' };
        component.setFormGroup(mockCaption);
        component.editGroups.patchValue({});
        tick(500);
        expect(component.save).toHaveBeenCalled();
      })
    );

    it('should create editGroup', () => {
      component.createCaption();
      expect(component.editGroups.value).toEqual({
        id: '',
        uid: '',
        label: '',
        value: '',
        displayClass: '',
        colorClass: 'btn-primary',
        style: ''
      });
    });
  });

  describe('save action', () => {
    it('should not trigger disaptch when editGroup is not valid', () => {
      spyOn(store, 'dispatch');
      const formValue = { label: 'test', style: '' };
      component.editGroups.patchValue(formValue);
      component.save(formValue);
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch AddCaption action', () => {
      spyOn(store, 'dispatch');
      spyOn(component, 'createCaption');
      const formValue = { label: 'test', value: 'test', style: '' };
      const dispatchFormValue = { label: 'test', value: 'test', style: '' };
      component.editGroups.patchValue(formValue);
      component.save(formValue);
      expect(store.dispatch).toHaveBeenCalledWith(
        new AddCaption(dispatchFormValue)
      );
      expect(component.createCaption).toHaveBeenCalled();
    });

    it('should dispatch UpdateCaption action', () => {
      spyOn(store, 'dispatch');
      spyOn(component, 'createCaption');
      const formValue = { id: '1', label: 'test', value: 'test', style: '' };
      const dispatchFormValue = {
        id: '1',
        label: 'test',
        value: 'test',
        style: ''
      };
      component.editGroups.patchValue(formValue);
      component.save(formValue);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UpdateCaption(dispatchFormValue)
      );
    });

    it('should use editGroups value', () => {
      spyOn(store, 'dispatch');
      const formValue = { id: '1', label: 'test', value: 'test', style: '' };
      const dispatchFormValue = {
        id: '1',
        label: 'test',
        value: 'test',
        style: {}
      };
      component.editGroups.patchValue(formValue);
      component.save(undefined);
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  it('should remove caption', () => {
    component.editGroups.patchValue({ id: 1 });
    spyOn(store, 'dispatch');
    spyOn(component, 'createCaption');
    component.remove();
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveCaption(1));
    expect(component.createCaption).toHaveBeenCalled();
  });

  it('should return itemId as trackBy key', () => {
    expect(component.trackByfn(1, { id: 1 })).toBe(1);
  });

  it('should setTab', () => {
    spyOn(component, 'resetValue');
    component.setTab('test');
    expect(component.currentTab).toBe('test');
    expect(component.resetValue).toHaveBeenCalled();
  });
});
