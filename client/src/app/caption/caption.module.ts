import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { AceEditorModule } from 'ng2-ace-editor';
import { DisplayComponent } from './display/display.component';
import { PanelEditComponent } from './panel-edit/panel-edit.component';
import { PanelComponent } from './panel/panel.component';
import { CaptionItemsState } from './sotre/caption-items.state';
import { EnvironmentState } from './sotre/environment.state';

export const routes = [
  { path: 'display/:room', component: DisplayComponent },
  { path: 'edit', component: PanelEditComponent },
  { path: '', component: PanelComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AceEditorModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([EnvironmentState, CaptionItemsState])
  ],
  declarations: [DisplayComponent, PanelComponent, PanelEditComponent]
})
export class CaptionModule {}
