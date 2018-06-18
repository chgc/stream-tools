import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  imports: [CommonModule, YoutubeRoutingModule, ReactiveFormsModule],
  declarations: [ChatComponent]
})
export class YoutubeModule {}
