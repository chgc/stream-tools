import { Action, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { CaptionService } from '../services/caption.service';
import {
  GetCaptionList,
  AddCaption,
  UpdateCaption,
  RemoveCaption
} from './caption-items.action';

export interface CaptionModel {
  id: string;
  label: string;
  value: string;
  colorClass: string;
  style: { [key: string]: string };
}

@State<CaptionModel[]>({
  name: 'captions',
  defaults: []
})
export class CaptionItemsState {
  constructor(private captionService: CaptionService, private store: Store) {}

  @Action(GetCaptionList)
  getCaptionList(ctx: StateContext<CaptionModel[]>, action: GetCaptionList) {
    const currentState = ctx.getState();
    const uid = this.store.selectSnapshot(state => state.environement.uid);
    const updateCaptionsListState = (captions: CaptionModel[]) =>
      ctx.setState([...captions]);

    return this.captionService
      .getCaptionList()
      .pipe(tap(updateCaptionsListState));
  }

  @Action(AddCaption)
  addCaption(ctx: StateContext<CaptionModel[]>, action: AddCaption) {
    return this.captionService
      .createAndUpdateCaption(null, action.payload)
      .then(() => ctx.dispatch(new GetCaptionList()));
  }

  @Action(UpdateCaption)
  saveCaption(ctx: StateContext<CaptionModel[]>, action: UpdateCaption) {
    return this.captionService
      .createAndUpdateCaption(action.payload.id, action.payload)
      .then(() => ctx.dispatch(new GetCaptionList()));
  }

  @Action(RemoveCaption)
  removeCaption(ctx: StateContext<CaptionModel[]>, action: RemoveCaption) {
    return this.captionService
      .removeCaption(action.id)
      .then(() => ctx.dispatch(new GetCaptionList()));
  }
}
