import { State, StateContext, Action } from '@ngxs/store';
import { ObsService } from '../services/obs.service';
import { ObsDispatchEvent } from '@store/obs.actions';
import {
  SourceRenderToggle,
  GetSourceMuteState,
  SourceMuteToggle
} from '@store/source.actions';
import { GetCurrentScene } from '@store/scene.actions';

export interface SourceModel {
  name: string;
  render: boolean;
  volume: number;
  type: string;
  muted?: boolean;
}

@State<SourceModel[]>({
  name: 'sources',
  defaults: []
})
export class SourcesState {
  constructor(private service: ObsService) {}

  @Action(GetSourceMuteState)
  getSourceMuteState(
    ctx: StateContext<SourceModel[]>,
    action: GetSourceMuteState
  ) {
    const requestGetMute = source =>
      this.service.requestCommand({
        ...this.service.requestTask('GetMute'),
        payload: { source: source.name }
      });
    ctx.getState().map(requestGetMute.bind(this));
  }

  @Action(SourceRenderToggle)
  setSourceProperty(
    ctx: StateContext<SourceModel[]>,
    action: SourceRenderToggle
  ) {
    this.service.requestCommand({
      ...this.service.requestTask('SetSceneItemProperties'),
      payload: { item: action.source.name, visible: !action.source.render }
    });
  }

  @Action(SourceMuteToggle)
  toggleSourceMute(ctx: StateContext<SourceModel[]>, action: SourceMuteToggle) {
    this.service.requestCommand({
      ...this.service.requestTask('ToggleMute'),
      payload: { source: action.source.name }
    });
  }

  @Action(ObsDispatchEvent)
  receiveEvent(ctx: StateContext<SourceModel[]>, action: ObsDispatchEvent) {
    if (action.payload['update-type']) {
      this.processUpdateEvent(ctx, action);
      return;
    }
    const { id, actionType } = this.service.getActionType(action.payload);
    const state = ctx.getState();
    switch (actionType) {
      case 'GetSceneList':
        action.payload.scenes
          .filter(s => s.name === action.payload['current-scene'])
          .map(scene => ctx.setState([...scene.sources]));
        ctx.dispatch(new GetSourceMuteState());
        break;
      case 'GetCurrentScene':
        ctx.setState([...action.payload.sources]);
        ctx.dispatch(new GetSourceMuteState());
        break;
      case 'ToggleMute':
      case 'GetMute':
        const sources = state.map(source => {
          if (source.name === action.payload.name) {
            source.muted = action.payload.muted;
          }
          return source;
        });
        ctx.setState([...sources]);
        break;
    }
  }

  private processUpdateEvent(
    ctx: StateContext<SourceModel[]>,
    action: ObsDispatchEvent
  ) {
    const state = ctx.getState();
    switch (action.payload['update-type']) {
      case 'SwitchScenes':
        ctx.setState([...action.payload.sources]);
        ctx.dispatch(new GetSourceMuteState());
        break;
      case 'SceneItemVisibilityChanged':
        const newstate = state.map(x => {
          if (x.name === action.payload['item-name']) {
            x.render = action.payload['item-visible'];
          }
          return x;
        });
        ctx.setState([...newstate]);
        break;
      case 'SceneItemAdded':
      case 'SceneItemRemoved':
      case 'SourceOrderChanged':
        ctx.dispatch(new GetCurrentScene());
        break;
    }
  }
}
