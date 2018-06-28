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
  uid: string;
  label: string;
  value: string;
  displayCalss: string;
  colorClass: string;
  style: string;
}

@State<CaptionModel[]>({
  name: 'captions',
  defaults: []
})
export class CaptionItemsState {
  constructor(private captionService: CaptionService, private store: Store) {}

  @Action(GetCaptionList)
  getCaptionList(ctx: StateContext<CaptionModel[]>, action: GetCaptionList) {
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
      .pipe(tap(() => ctx.dispatch(new GetCaptionList())));
  }

  @Action(UpdateCaption)
  saveCaption(ctx: StateContext<CaptionModel[]>, action: UpdateCaption) {
    return this.captionService
      .createAndUpdateCaption(action.payload.id, action.payload)
      .pipe(tap(() => ctx.dispatch(new GetCaptionList())));
  }

  @Action(RemoveCaption)
  removeCaption(ctx: StateContext<CaptionModel[]>, action: RemoveCaption) {
    return this.captionService
      .removeCaption(action.id)
      .pipe(tap(() => ctx.dispatch(new GetCaptionList())));
  }
}
