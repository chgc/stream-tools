import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { EditableGuard } from './editable.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentState } from './sotre/environment.state';
import { AngularFirestore } from 'angularfire2/firestore';

describe('EditableGuard', () => {
  const FakeAngularFirestore = jasmine.createSpyObj('AngularFirestore', [
    'doc',
    'createId'
  ]);
  let guard: EditableGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditableGuard,
        { provide: AngularFirestore, useValue: FakeAngularFirestore }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxsModule.forRoot([EnvironmentState])
      ]
    });

    guard = TestBed.get(EditableGuard);
  });

  it('should ...', () => {
    expect(guard).toBeTruthy();
  });
});
