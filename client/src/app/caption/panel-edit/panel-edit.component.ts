import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import {
  GetCaptionList,
  UpdateCaption,
  AddCaption,
  RemoveCaption
} from '../sotre/caption-items.action';
import {
  GetAreaPosition,
  GetCustomCSS,
  SetUserID
} from '../sotre/environment.action';
import { AuthService } from '../../auth.service';
import { ToolsService } from '../services/tools.service';
import {
  filter,
  map,
  tap,
  mergeMap,
  takeUntil,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import 'brace';
import 'brace/theme/github';
import 'brace/mode/json';
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
  destroy$ = new Subject();
  customCSS = '';
  areaPosition = {
    MAX_WIDTH: 1620,
    MAX_HEIGHT: 980,
    START_X: 100,
    START_Y: 50
  };

  constructor(
    private authService: AuthService,
    private store: Store,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.store.select(state => state.environement).subscribe(caption => {
      this.areaPosition = caption.areaPosition;
      this.customCSS = caption.customCSS;
    });

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
      .subscribe(() => {});
  }

  setFormGroup(caption) {
    this.destroy$.next();
    try {
      caption = {
        ...caption,
        style: JSON.stringify(caption.style) || ''
      };
    } catch {}
    this.editGroups.reset(caption);

    this.editGroups.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500))
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
    } catch {}
    if (formValue.id) {
      this.store.dispatch(new UpdateCaption(formValue));
    } else {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
