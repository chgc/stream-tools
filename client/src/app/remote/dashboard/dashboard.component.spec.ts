import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: AuthService;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const fakeAuthServiceSpy = jasmine.createSpyObj('AuthService', ['signOut']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: fakeAuthServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger authService signOut', () => {
    component.signOut();
    expect(fakeAuthServiceSpy.signOut).toHaveBeenCalled();
  });

  it('should go to CaptionControl', () => {
    component.goToCaptionControl();
    const navArgs = routerSpy.navigate.calls.first().args[0];
    expect(navArgs[0]).toContain('/main/caption');
  });
});
