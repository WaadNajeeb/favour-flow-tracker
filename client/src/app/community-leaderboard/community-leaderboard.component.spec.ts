import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityLeaderboardComponent } from './community-leaderboard.component';

describe('CommunityLeaderboardComponent', () => {
  let component: CommunityLeaderboardComponent;
  let fixture: ComponentFixture<CommunityLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
