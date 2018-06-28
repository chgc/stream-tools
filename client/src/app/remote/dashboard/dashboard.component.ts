import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import {
  ObsConnect,
  ObsRecordingToggle,
  ObsStreamingToggle,
  ObsDisconnect
} from '@store/obs.actions';
import { ScenesSwitch } from '@store/scene.actions';
import { SceneModel } from '@store/scenes.state';
import { SourceRenderToggle, SourceMuteToggle } from '@store/source.actions';
import { SourceModel } from '@store/source.state';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  connectInfo = this.fb.group({
    host: ['localhost'],
    port: ['4444'],
    auto: [false]
  });
  sceneGroups = this.fb.group({
    scene: []
  });

  @Select(state => state.obs.isConnect)
  isConnect$;

  @Select(state => state.obs.scenes)
  scenes$: Observable<SceneModel[]>;

  @Select(state => state.obs['current-scene'])
  currentScene$: Observable<string>;

  @Select(state => state.obs.sources)
  sources$: Observable<SourceModel[]>;
  displayStreamingButton$;
  displayRecordingButton$;
  constructor(private fb: FormBuilder, private store: Store) {
    this.store
      .select(state => state.obs['current-scene'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(value =>
        this.sceneGroups.get('scene').setValue(value, { emitEvent: false })
      );

    this.displayStreamingButton$ = store.select(state => state.obs).pipe(
      map(obs => {
        if (obs.streaming) {
          return `${obs.streamStartStopping ? 'stopping' : 'stop'} streaming`;
        }
        return `${obs.streamStartStopping ? 'starting' : 'start'} streaming`;
      })
    );
    this.displayRecordingButton$ = store.select(state => state.obs).pipe(
      map(obs => {
        if (obs.recording) {
          return `${obs.recordStartStopping ? 'stopping' : 'stop'} recording`;
        }
        return `${obs.recordStartStopping ? 'starting' : 'start'} recording`;
      })
    );
  }

  ngOnInit() {
    if (localStorage.getItem('connectInfo')) {
      this.connectInfo.setValue(
        JSON.parse(localStorage.getItem('connectInfo'))
      );

      if (this.connectInfo.get('auto').value) {
        this.connect();
      }
    }

    this.sceneGroups.valueChanges
      .pipe(
        filter(value => value),
        tap(data => {
          if (data.auto) {
            this.connect();
          }
        })
      )
      .subscribe(data => {
        this.store.dispatch(new ScenesSwitch(data.scene));
      });
  }

  connect() {
    localStorage.setItem('connectInfo', JSON.stringify(this.connectInfo.value));
    this.store.dispatch(
      new ObsConnect(
        this.connectInfo.get('host').value,
        this.connectInfo.get('port').value
      )
    );
  }

  disconnect() {
    this.store.dispatch(new ObsDisconnect());
  }

  toggleRender(source) {
    this.store.dispatch(new SourceRenderToggle(source));
  }

  toggleMute(source) {
    this.store.dispatch(new SourceMuteToggle(source));
  }
  toggleStreaming() {
    this.store.dispatch(new ObsStreamingToggle());
  }

  toggleRecording() {
    this.store.dispatch(new ObsRecordingToggle());
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
