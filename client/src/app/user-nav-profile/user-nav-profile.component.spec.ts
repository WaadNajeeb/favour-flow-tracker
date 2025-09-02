import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavProfileComponent } from './user-nav-profile.component';

describe('UserNavProfileComponent', () => {
  let component: UserNavProfileComponent;
  let fixture: ComponentFixture<UserNavProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNavProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNavProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
