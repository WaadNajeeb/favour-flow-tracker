import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedForMeComponent } from './completed-for-me.component';

describe('CompletedForMeComponent', () => {
  let component: CompletedForMeComponent;
  let fixture: ComponentFixture<CompletedForMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedForMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedForMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
