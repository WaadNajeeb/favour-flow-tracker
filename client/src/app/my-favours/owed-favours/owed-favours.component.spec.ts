import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwedFavoursComponent } from './owed-favours.component';

describe('OwedFavoursComponent', () => {
  let component: OwedFavoursComponent;
  let fixture: ComponentFixture<OwedFavoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwedFavoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwedFavoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
