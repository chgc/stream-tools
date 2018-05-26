import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { DashboardComponent } from './dashboard.component';
import { NgxsModule } from '@ngxs/store';
import { ObsState } from '@store/obs.state';
import { ScenesState } from '@store/scenes.state';
import { SourcesState } from '@store/source.state';
import { TransitionState } from '@store/transition.state';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        ReactiveFormsModule,
        NgxsModule.forRoot([
          ObsState,
          ScenesState,
          SourcesState,
          TransitionState
        ])
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
