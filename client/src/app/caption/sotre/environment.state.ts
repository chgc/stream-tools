import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { CaptionService } from '../services/caption.service';
import {
  GetAreaPosition,
  GetCustomCSS,
  SetDisplayUrl,
  SetUserID,
  SetCustomCSS,
  SetAreaPosition
} from './environment.action';
export interface CaptionPanelModel {
  uid: string;
  displayUrl: string;
  customCSS: string;
  areaPosition: { [key: string]: number };
}

@State<CaptionPanelModel>({
  name: 'environement',
  defaults: {
    uid: '',
    displayUrl: '',
    customCSS: '',
    areaPosition: {
      MAX_WIDTH: 1620,
      MAX_HEIGHT: 980,
      START_X: 100,
      START_Y: 50
    }
  }
})
export class EnvironmentState {
  constructor(private captionService: CaptionService) {}

  @Action(SetUserID)
  setUserId(ctx: StateContext<CaptionPanelModel>, action: SetUserID) {
    ctx.setState({ ...ctx.getState(), uid: action.uid });
    return this.captionService.initFireStore(action.uid);
  }

  @Action(SetDisplayUrl)
  gettDisplayUrl(ctx: StateContext<CaptionPanelModel>, action: SetDisplayUrl) {
    const currentState = ctx.getState();
    ctx.setState({
      ...currentState,
      displayUrl: `${location.origin}/main/caption/display/${currentState.uid}`
    });
  }

  @Action(GetAreaPosition)
  getAreaPosition(
    ctx: StateContext<CaptionPanelModel>,
    action: GetAreaPosition
  ) {
    const currentState = ctx.getState();
    const updateAreaPositionState = areaPosition =>
      ctx.setState({ ...currentState, areaPosition });

    return this.captionService
      .getAreaPosition()
      .pipe(tap(updateAreaPositionState));
  }

  @Action(SetAreaPosition)
  setAreaPosition(
    ctx: StateContext<CaptionPanelModel>,
    action: SetAreaPosition
  ) {
    return this.captionService
      .setAreaPosition(action.payload)
      .then(() => ctx.dispatch(new GetAreaPosition()));
  }

  @Action(GetCustomCSS)
  getCustomCSS(ctx: StateContext<CaptionPanelModel>, action: GetCustomCSS) {
    const currentState = ctx.getState();
    const updateCustomCSSState = customCSS =>
      ctx.setState({ ...currentState, customCSS });
    return this.captionService.getCustomCSS().pipe(tap(updateCustomCSSState));
  }

  @Action(SetCustomCSS)
  setCustomCSS(ctx: StateContext<CaptionPanelModel>, action: SetCustomCSS) {
    return this.captionService
      .setCustomCSS(action.payload)
      .then(() => ctx.dispatch(new GetCustomCSS()));
  }
}
