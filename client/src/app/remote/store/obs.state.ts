import { Action, State, StateContext } from '@ngxs/store';
import { ScenesLoad } from '@store/scene.actions';
import { SourcesState } from '@store/source.state';
import { TransitionLoad } from '@store/transition.action';
import { TransitionState } from '@store/transition.state';
import { from, Subject } from 'rxjs';
import { concatMap, filter, take, takeUntil, tap } from 'rxjs/operators';
import { ObsService } from '../services/obs.service';
import {
  ObsConnect,
  ObsConnected,
  ObsDisconnect,
  ObsDispatchEvent,
  ObsError,
  ObsRecordingToggle,
  ObsStreamingStatus,
  ObsStreamingToggle
} from './obs.actions';
import { ScenesState } from './scenes.state';
export interface ObsModel {
  'current-scene': string;
  'current-transition': string;
  streaming: boolean;
  streamStartStopping: boolean;
  recording: boolean;
  recordStartStopping: boolean;
  isConnect: boolean;
}

@State<ObsModel>({
  name: 'obs',
  defaults: {
    'current-scene': '',
    'current-transition': '',
    streaming: false,
    streamStartStopping: false,
    recording: false,
    recordStartStopping: false,
    isConnect: false
  },
  children: [ScenesState, SourcesState, TransitionState]
})
export class ObsState {
  destroy$ = new Subject();
  constructor(private service: ObsService) {}

  @Action(ObsConnect)
  connect(ctx: StateContext<ObsModel>, action: ObsConnect) {
    this.service.connect(
      action.host,
      action.port
    );

    const initialAction = message => {
      const state = ctx.getState();
      if (message && message.status === 'ok') {
        ctx.setState({
          ...state,
          isConnect: true
        });
        this.service.requestCommand({
          ...this.service.requestTask('SetHeartbeat'),
          payload: { enable: true }
        });
        from([
          new ObsConnected(),
          new ScenesLoad(),
          new TransitionLoad(),
          new ObsStreamingStatus()
        ])
          .pipe(concatMap(_action => ctx.dispatch(_action)))
          .subscribe();
      }
    };

    return this.service.channel$.pipe(
      take(1),
      tap(initialAction)
    );
  }

  @Action(ObsDisconnect)
  disconnect(ctx: StateContext<ObsModel>, action: ObsDisconnect) {
    this.service.disconnect();
    const state = ctx.getState();
    ctx.setState({ ...state, isConnect: false });
    this.destroy$.next('');
  }

  @Action(ObsConnected)
  broadcastResponse(ctx: StateContext<ObsModel>, action: ObsConnected) {
    this.service.channel$
      .pipe(
        takeUntil(this.destroy$),
        filter(response => response['update-type'] !== 'Heartbeat')
      )
      .subscribe(
        response => ctx.dispatch(new ObsDispatchEvent(response)),
        error => ctx.dispatch(new ObsError())
      );
  }

  @Action(ObsError)
  obsOnError(ctx: StateContext<ObsModel>, action: ObsError) {
    const state = ctx.getState();
    ctx.setState({ ...state, isConnect: false });
  }

  @Action(ObsStreamingStatus)
  getStreamingStatus(ctx: StateContext<ObsModel>, action: ObsStreamingStatus) {
    this.service.requestCommand({
      ...this.service.requestTask('GetStreamingStatus')
    });
  }

  @Action(ObsStreamingToggle)
  startStopStreaming(ctx: StateContext<ObsModel>, action: ObsStreamingToggle) {
    this.service.requestCommand({
      ...this.service.requestTask('StartStopStreaming')
    });
  }

  @Action(ObsRecordingToggle)
  startStopRecording(ctx: StateContext<ObsModel>, action: ObsRecordingToggle) {
    this.service.requestCommand({
      ...this.service.requestTask('StartStopRecording')
    });
  }

  // watch event stream
  @Action(ObsDispatchEvent)
  receiveEvent(ctx: StateContext<ObsModel>, action: ObsDispatchEvent) {
    if (action.payload['update-type']) {
      this.processUpdateEvent(ctx, action);
      return;
    }
    const state = ctx.getState();
    const { id, actionType } = this.service.getActionType(action.payload);
    switch (actionType) {
      case 'GetSceneList':
        ctx.setState({
          ...state,
          'current-scene': action.payload['current-scene']
        });
        break;
      case 'GetTransitionList':
        ctx.setState({
          ...state,
          'current-transition': action.payload['current-transition']
        });
        break;
      case 'GetStreamingStatus':
        ctx.setState({
          ...state,
          streaming: action.payload.streaming,
          recording: action.payload.recording
        });
        break;
    }
  }

  private processUpdateEvent(
    ctx: StateContext<ObsModel>,
    action: ObsDispatchEvent
  ) {
    const state = ctx.getState();
    switch (action.payload['update-type']) {
      case 'SwitchScenes':
        ctx.setState({
          ...state,
          'current-scene': action.payload['scene-name']
        });
        break;
      case 'SwitchTransition':
        ctx.setState({
          ...state,
          'current-transition': action.payload['transition-name']
        });
        break;
      case 'RecordingStarting':
      case 'RecordingStopping':
        ctx.setState({ ...state, recordStartStopping: true });
        break;
      case 'RecordingStarted':
        ctx.setState({ ...state, recording: true, recordStartStopping: false });
        break;
      case 'RecordingStopped':
        ctx.setState({
          ...state,
          recording: false,
          recordStartStopping: false
        });
        break;
      case 'StreamStatus':
        ctx.setState({
          ...state,
          streaming: action.payload.streaming,
          recording: action.payload.recording
        });
        break;
      case 'StreamStarting':
      case 'StreamStopping':
        ctx.setState({ ...state, streamStartStopping: true });
        break;
      case 'StreamStarted':
        ctx.setState({ ...state, streaming: true, streamStartStopping: false });
        break;
      case 'StreamStopped':
        ctx.setState({
          ...state,
          streaming: false,
          streamStartStopping: false
        });
        break;
    }
  }
}
