import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import 'brace';
import 'brace/mode/css';
import 'brace/mode/json';
import 'brace/theme/github';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  takeUntil,
  tap,
  take,
  mergeMap,
  distinctUntilChanged
} from 'rxjs/operators';
import { AuthService } from '../../auth.service';
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
  SetUserID
} from '../sotre/environment.action';
import { AngularFirestore } from 'angularfire2/firestore';
declare var ace: any;

@Component({
  selector: 'app-panel-edit',
  templateUrl: './panel-edit.component.html',
  styleUrls: ['./panel-edit.component.css']
})
export class PanelEditComponent implements OnInit, OnDestroy {
  @Select(state => state.captions)
  items$: Observable<any>;

  editGroups: FormGroup = this.fb.group({
    id: '',
    uid: '',
    label: ['', [Validators.required]],
    value: ['', [Validators.required]],
    displayClass: '',
    colorClass: 'btn-primary',
    style: ''
  });

  areaPositionGroup = this.fb.group({
    maxWidth: [],
    maxHeight: [],
    startX: [],
    startY: []
  });

  customCSSGroup = this.fb.group({
    customCSS: ''
  });

  destroy$ = new Subject();
  stop$ = new Subject();
  currentTab = 'caption';

  constructor(
    private authService: AuthService,
    private store: Store,
    private fb: FormBuilder,
    private fireStore: AngularFirestore
  ) {}

  ngOnInit() {
    this.resetValue();
    this.initAreaEnvironmentFormGroup();
    this.initCustomCSSGroup();
  }

  clone() {
    this.authService.authState
      .pipe(
        take(1),
        mergeMap(user => {
          return this.fireStore
            .collection(`caption/${user.uid}/captions`)
            .valueChanges()
            .pipe(take(1));
        }),
        tap(captions => {
          captions.forEach((caption: any) => {
            let style = '';
            try {
              style = JSON.stringify(caption.style);
            } catch {}
            this.store.dispatch(
              new AddCaption({
                label: caption.label,
                value: caption.value,
                displayClass: caption.displayClass,
                colorClass: caption.colorClass,
                style: style
              })
            );
          });
        })
      )
      .subscribe();
  }
  resetValue() {
    this.store.selectOnce(state => state.environement).subscribe(env => {
      if (env.areaPosition) {
        this.areaPositionGroup.reset(env.areaPosition, {
          emitEvent: false
        });
      }
      if (env.customCSS) {
        this.customCSSGroup.reset(
          { customCSS: env.customCSS },
          { emitEvent: false }
        );
      }
    });
  }

  initAreaEnvironmentFormGroup() {
    this.areaPositionGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500)
      )
      .subscribe(value => {
        this.store.dispatch(new SetAreaPosition(value));
      });
  }

  initCustomCSSGroup() {
    this.customCSSGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500)
      )
      .subscribe(value =>
        this.store.dispatch(new SetCustomCSS(value.customCSS))
      );
  }

  setFormGroup(caption) {
    this.stop$.next();
    try {
      caption = {
        ...caption,
        style: JSON.stringify(caption.style, null, 2) || ''
      };
    } catch {}
    this.editGroups.reset(caption);

    this.editGroups.valueChanges
      .pipe(
        takeUntil(this.stop$),
        debounceTime(500)
      )
      .subscribe(formValue => this.save(formValue));
  }

  createCaption() {
    this.stop$.next();
    this.editGroups.reset({
      id: '',
      uid: '',
      label: '',
      value: '',
      displayClass: '',
      colorClass: 'btn-primary',
      style: ''
    });
  }

  copyCaption() {
    this.stop$.next();
    const caption = this.editGroups.getRawValue();
    this.editGroups.reset({
      ...caption,
      id: ''
    });
  }

  save(formValue) {
    if (this.editGroups.invalid) {
      return;
    }
    formValue = formValue || this.editGroups.getRawValue();
    try {
      formValue = {
        ...formValue,
        style: formValue.style
      };
    } catch {}
    if (formValue.id) {
      this.store.dispatch(new UpdateCaption(formValue));
    } else {
      delete formValue.id;
      this.store.dispatch(new AddCaption(formValue));
      this.createCaption();
    }
  }

  remove() {
    const id = this.editGroups.get('id').value;
    this.store.dispatch(new RemoveCaption(id));
    this.createCaption();
  }

  trackByfn(index, item) {
    return item.id;
  }

  setTab(tab) {
    this.currentTab = tab;
    this.resetValue();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
