import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ObsDisconnect } from '@store/obs.actions';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  isDisplay;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private http: HttpClient
  ) {
    this.isDisplay =
      this.router.url.includes('/main/caption/display') ||
      this.router.url.includes('/main/youtube/prizeDisplay');
  }

  ngOnInit() {}

  signOut() {
    this.authService.signOut().then(() => {
      this.store.dispatch(new ObsDisconnect());
    });
  }
}
