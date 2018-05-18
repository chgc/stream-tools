import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DisplayComponent } from './display/display.component';
import { PanelComponent } from './panel/panel.component';
import { NgxsModule } from '@ngxs/store';
import { EnvironmentState } from './sotre/environment.state';
import { CaptionItemsState } from './sotre/caption-items.state';

export const routes = [
  { path: 'display/:room', component: DisplayComponent },
  { path: '', component: PanelComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([EnvironmentState, CaptionItemsState])
  ],
  declarations: [DisplayComponent, PanelComponent]
})
export class CaptionModule {}
