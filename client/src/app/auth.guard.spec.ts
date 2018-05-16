import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { NgxsModule } from '@ngxs/store';
import { ObsState } from '@store/obs.state';
import { ScenesState } from '@store/scenes.state';
import { SourcesState } from '@store/source.state';
import { TransitionState } from '@store/transition.state';

describe('ConnectGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
      imports: [NgxsModule.forRoot([ObsState, ScenesState, SourcesState, TransitionState]), RouterTestingModule]
    });
  });

  it(
    'should ...',
    inject([AuthGuard], (guard: AuthGuard) => {
      expect(guard).toBeTruthy();
    })
  );
});
