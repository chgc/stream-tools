import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ObsState } from './store/obs.state';
import { ScenesState } from './store/scenes.state';
import { SourcesState } from './store/source.state';
import { TransitionState } from './store/transition.state';
import { NgxsModule } from '@ngxs/store';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([
      ObsState,
      ScenesState,
      SourcesState,
      TransitionState
    ])
  ],
  declarations: [DashboardComponent]
})
export class RemoteModule {}
