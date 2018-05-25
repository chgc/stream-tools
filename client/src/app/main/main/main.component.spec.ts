import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth.service';
import { MainComponent } from './main.component';
import { NgxsModule } from '@ngxs/store';
import { ObsState } from '@store/obs.state';
import { ScenesState } from '@store/scenes.state';
import { TransitionState } from '@store/transition.state';
import { SourcesState } from '@store/source.state';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let authService: AuthService;

  const fakeAuthServiceSpy = jasmine.createSpyObj('AuthService', ['signOut']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([
          ObsState,
          ScenesState,
          SourcesState,
          TransitionState
        ])
      ],
      providers: [{ provide: AuthService, useValue: fakeAuthServiceSpy }]
    });
  });

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
    fakeAuthServiceSpy.signOut.and.returnValue(Promise.resolve());
    component.signOut();
    expect(fakeAuthServiceSpy.signOut).toHaveBeenCalled();
  });
});
