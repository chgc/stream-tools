import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AuthService } from '../../auth.service';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let authService: AuthService;

  const fakeAuthServiceSpy = jasmine.createSpyObj('AuthService', ['signOut']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent],
      providers: [{ provide: AuthService, useValue: fakeAuthServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
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
});
