import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedFavoursComponent } from './completed-favours.component';

describe('CompletedFavoursComponent', () => {
  let component: CompletedFavoursComponent;
  let fixture: ComponentFixture<CompletedFavoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedFavoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedFavoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
