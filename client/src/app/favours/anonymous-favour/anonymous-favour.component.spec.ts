import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousFavourComponent } from './anonymous-favour.component';

describe('AnonymousFavourComponent', () => {
  let component: AnonymousFavourComponent;
  let fixture: ComponentFixture<AnonymousFavourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonymousFavourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousFavourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
