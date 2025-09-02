import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OweFavoursComponent } from './owe-favours.component';

describe('OweFavoursComponent', () => {
  let component: OweFavoursComponent;
  let fixture: ComponentFixture<OweFavoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OweFavoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OweFavoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
