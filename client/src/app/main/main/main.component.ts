import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  isDisplay;
  constructor(private authService: AuthService, private router: Router) {
    this.isDisplay = this.router.url.includes('/main/caption/display');
  }

  ngOnInit() {}

  signOut() {
    this.authService.signOut();
  }
}
