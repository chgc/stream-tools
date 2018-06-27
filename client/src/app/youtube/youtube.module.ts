import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { ChatComponent } from './chat/chat.component';
import { PrizeDisplayComponent } from './prize-display/prize-display.component';

@NgModule({
  imports: [CommonModule, YoutubeRoutingModule, ReactiveFormsModule],
  declarations: [ChatComponent, PrizeDisplayComponent]
})
export class YoutubeModule {}
