import { TestBed, async, inject } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { EditableGuard } from './editable.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentState } from './sotre/environment.state';

describe('EditableGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditableGuard],
      imports: [RouterTestingModule, NgxsModule.forRoot([EnvironmentState])]
    });
  });

  it(
    'should ...',
    inject([EditableGuard], (guard: EditableGuard) => {
      expect(guard).toBeTruthy();
    })
  );
});
