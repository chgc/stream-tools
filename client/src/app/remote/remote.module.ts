import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RemoteComponent } from './remote.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ObsGuard } from './obs.guard';
export const routes: Route[] = [
  {
    path: '',
    component: RemoteComponent,
    canActivateChild: [ObsGuard],
    children: [{ path: 'dashboard', component: DashboardComponent }]
  }
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  providers: [ObsGuard],
  declarations: [RemoteComponent, DashboardComponent]
})
export class RemoteModule {}
