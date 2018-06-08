import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.http
      .get(
        'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=all'
      )
      .subscribe(value => {
        console.log(value);
      });
  }
}
