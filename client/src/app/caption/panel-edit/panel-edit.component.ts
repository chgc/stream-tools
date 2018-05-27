import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import 'brace';
import 'brace/mode/css';
import 'brace/mode/json';
import 'brace/theme/github';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { AddCaption, GetCaptionList, RemoveCaption, UpdateCaption } from '../sotre/caption-items.action';
import { GetAreaPosition, GetCustomCSS, SetAreaPosition, SetCustomCSS, SetUserID } from '../sotre/environment.action';
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
    label: ['', [Validators.required]],
    value: ['', [Validators.required]],
    colorClass: '',
    style: ''
  });

  areaPositionGroup = this.fb.group({
    MAX_WIDTH: 1620,
    MAX_HEIGHT: 980,
    START_X: 100,
    START_Y: 50
  });

  customCSSGroup = this.fb.group({
    customCSS: ''
  })

  destroy$ = new Subject();
  stop$ = new Subject();
  currentTab = 'caption';

  constructor(
    private authService: AuthService,
    private store: Store,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.store.selectOnce(state => state.environement).subscribe(caption => {
      this.areaPositionGroup.reset(caption.areaPosition);
      this.customCSSGroup.reset({ customCSS: caption.customCSS });
    });

    this.initAuthAction();
    this.initAreaEnvironmentFormGroup();
    this.initCustomCSSGroup();
  }

  initAuthAction() {

    const setUserID = userId => {
      this.store.dispatch(new SetUserID(userId));
    };

    const loadData = userId =>
      this.store.dispatch([
        new GetCaptionList(),
        new GetAreaPosition(),
        new GetCustomCSS()
      ]);

    this.authService.authState
      .pipe(
        filter(user => !!user),
        map(user => user.uid),
        tap(setUserID),
        map(loadData)
      )
      .subscribe();
  }

  initAreaEnvironmentFormGroup() {
    this.areaPositionGroup.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)).subscribe(value => this.store.dispatch(new SetAreaPosition(value)));
  }

  initCustomCSSGroup() {
    this.customCSSGroup.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(value => this.store.dispatch(new SetCustomCSS(value.customCSS)));
  }

  setFormGroup(caption) {
    this.stop$.next();
    try {
      caption = {
        ...caption,
        style: JSON.stringify(caption.style, null, 2) || ''
      };
    } catch { }
    this.editGroups.reset(caption);

    this.editGroups.valueChanges
      .pipe(takeUntil(this.stop$), debounceTime(500))
      .subscribe(formValue => this.save(formValue));
  }

  createCaption() {
    this.editGroups.reset({
      id: '',
      label: '',
      value: '',
      colorClass: 'btn-primary',
      style: ''
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
        style: JSON.parse(formValue.style || '{}')
      };
    } catch { }
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
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
