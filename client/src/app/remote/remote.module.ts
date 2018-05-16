import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObsState } from './store/obs.state';
import { ScenesState } from './store/scenes.state';
import { SourcesState } from './store/source.state';
import { TransitionState } from './store/transition.state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ObsState, ScenesState, SourcesState, TransitionState])],
  declarations: []
})
export class RemoteModule {}
