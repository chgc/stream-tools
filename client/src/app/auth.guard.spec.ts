import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('ConnectGuard', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const FakeAuthServiceSpy = {
    authState: of('user')
  };

  let guard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: FakeAuthServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.get(AuthGuard);
    authService = TestBed.get(AuthService);
  });

  it('should ...', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when user is login', () => {
    guard
      .canActivateChild(null, { url: '' } as RouterStateSnapshot)
      .subscribe(value => {
        expect(value).toBe(true);
      });
  });

  it('should return true when url is display', () => {
    guard
      .canActivateChild(null, {
        url: 'main/caption/display/123456'
      } as RouterStateSnapshot)
      .subscribe(value => {
        expect(value).toBe(true);
      });
  });

  it('should return true when user is login', () => {
    authService.authState = of(null);

    guard
      .canActivateChild(null, { url: '' } as RouterStateSnapshot)
      .subscribe(value => {
        const navArgs = routerSpy.navigate.calls.first().args[0];
        expect(navArgs[0]).toContain('/login');
        expect(value).toBe(false);
      });
  });
});
