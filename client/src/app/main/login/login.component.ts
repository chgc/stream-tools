import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  signInWithSocial(loginProvider) {
    this.authService.signInWithSocial(loginProvider).subscribe(value => {
      this.router.navigate(['/main/remote']);
    });
  }
}
