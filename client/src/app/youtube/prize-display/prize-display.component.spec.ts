import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeDisplayComponent } from './prize-display.component';

describe('PrizeDisplayComponent', () => {
  let component: PrizeDisplayComponent;
  let fixture: ComponentFixture<PrizeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrizeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrizeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
