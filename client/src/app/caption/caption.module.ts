import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DisplayComponent } from './display/display.component';
import { PanelComponent } from './panel/panel.component';

export const routes = [{ path: 'display/:room', component: DisplayComponent }, { path: '', component: PanelComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [DisplayComponent, PanelComponent]
})
export class CaptionModule {}
