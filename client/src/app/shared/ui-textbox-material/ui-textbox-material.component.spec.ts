import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTextboxMaterialComponent } from './ui-textbox-material.component';

describe('UiTextboxMaterialComponent', () => {
  let component: UiTextboxMaterialComponent;
  let fixture: ComponentFixture<UiTextboxMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTextboxMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiTextboxMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
