import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ObsDisconnect } from '@store/obs.actions';

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
    private store: Store
  ) {
    this.isDisplay = this.router.url.includes('/main/caption/display');
  }

  ngOnInit() {}

  signOut() {
    this.authService.signOut().then(() => {
      this.store.dispatch(new ObsDisconnect());
    });
  }
}
