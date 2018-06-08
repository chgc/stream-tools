import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  imports: [
    CommonModule,
    YoutubeRoutingModule
  ],
  declarations: [ChatComponent]
})
export class YoutubeModule { }
