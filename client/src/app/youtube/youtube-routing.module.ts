import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { PrizeDisplayComponent } from './prize-display/prize-display.component';

const routes: Routes = [
  {
    path: 'prizeDisplay/:room',
    component: PrizeDisplayComponent
  },
  {
    path: '',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YoutubeRoutingModule {}
