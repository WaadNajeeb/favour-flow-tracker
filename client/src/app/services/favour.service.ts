import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../models/user';
import { HttpService, RequestMethod } from './http.service';
import { LocalStorageService } from './local-storage.service';
import { DurationType, FavourModel, FavourStatus, FavourType, PriorityType } from '../favours/create-favour/create-favour.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavourService {


  private readonly get_users_url: string = `${environment.apiUrl}/utils/get-users`;
  //public
  private readonly recent_favours: string = `${environment.apiUrl}/favour/recent`;
  private readonly community_leaderboard: string = `${environment.apiUrl}/favour/community-leaderboard`;
  private readonly leaderboard: string = `${environment.apiUrl}/favour/leaderboard`;
  private readonly get_favour: string = `${environment.apiUrl}/favour/get`;
  private readonly favour_public_request: string = `${environment.apiUrl}/favour/getpublicrequest`;

  // user-favour
  private readonly createFavourUrl: string = `${environment.apiUrl}/user-favour/create`;
  private readonly favourCountUrl: string = `${environment.apiUrl}/user-favour/counts`;
  private readonly favours_assigned_to_me = `${environment.apiUrl}/user-favour/favour-assigned-to-me`;
  private readonly favours_assigned_to_others = `${environment.apiUrl}/user-favour/favours-assigned-to-others`;
  private readonly favours_completed_by_me = `${environment.apiUrl}/user-favour/favours-completed-by-me`;
  private readonly favours_completed_by_others = `${environment.apiUrl}/user-favour/favours-completed-by-others`;
  private readonly favours_requires_verifications = `${environment.apiUrl}/user-favour/favours-requires-verifications`;
  private readonly favours_requires_other_verify = `${environment.apiUrl}/user-favour/favours-requires-other-verify`;
  private readonly favour_redeem_favour = `${environment.apiUrl}/user-favour/redeem-favour`;
  private readonly favour_verify_favour = `${environment.apiUrl}/user-favour/verify-favour`;

  private readonly update_favour = `${environment.apiUrl}/user-favour/update-favour`

  private httpService = inject(HttpService);
  private localStorageService = inject(LocalStorageService);

  getAllUsers() {
    return this.httpService.request<User[]>(RequestMethod.GET, this.get_users_url);
  }


  getRecentFavours() {
    return this.httpService.request<Favour[]>(RequestMethod.GET, this.recent_favours);
  }

  getCommunityFavours() {
    return this.httpService.request<CommunityLeaderboard[]>(RequestMethod.GET, this.community_leaderboard);
  }

  getLeaderboard(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<LeaderboardUser>>(
      RequestMethod.GET,
      `${this.leaderboard}?search=${search}&page=${page}`
    );
  }

  createFavour(favour: FavourModel) {
    return this.httpService.request<Result<FavourModel>>(RequestMethod.POST, this.createFavourUrl, favour);
  }

  favourCounts() {
    return this.httpService.request<FavourCount>(RequestMethod.GET, this.favourCountUrl);
  }

  favoursAssignedToMe(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<Favour>>(
      RequestMethod.GET,
      `${this.favours_assigned_to_me}?search=${search}&page=${page}`
    );
  }

  favoursAssignedToOthers(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<Favour>>(
      RequestMethod.GET,
      `${this.favours_assigned_to_others}?search=${search}&page=${page}`
    );
  }

  favoursCompletedByMe(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<Favour>>(
      RequestMethod.GET,
      `${this.favours_completed_by_me}?search=${search}&page=${page}`
    );
  }

  favoursCompletedByOthers(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<Favour>>(
      RequestMethod.GET,
      `${this.favours_completed_by_others}?search=${search}&page=${page}`
    );
  }

  favoursRequireMyVerify(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<Favour>>(
      RequestMethod.GET,
      `${this.favours_requires_verifications}?search=${search}&page=${page}`
    );
  }

  favoursRequireOtherVerify(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<Favour>>(
      RequestMethod.GET,
      `${this.favours_requires_other_verify}?search=${search}&page=${page}`
    );
  }

  getFavour(_id: string) {
    return this.httpService.request<Favour>(
      RequestMethod.GET,
      `${this.get_favour}/${_id}`
    );
  }

  getPublicRequest(search?: string, page: number = 1) {
    return this.httpService.request<PaginatedData<Favour>>(
      RequestMethod.GET,
      `${this.favour_public_request}?search=${search}&page=${page}`
    );
  }

  updateFavour(id: string, favour: FavourModel): Observable<Favour> {
    return this.httpService.request<Favour>(RequestMethod.PUT, `${this.update_favour}/${id}`, favour);
  }

  redeemFavour(id: string, model: RedeemFavour) {
    return this.httpService.request<Favour>(RequestMethod.PUT, `${this.favour_redeem_favour}/${id}`, model);
  }

  verifyFavour(id: string) {
    return this.httpService.request<Favour>(RequestMethod.PUT, `${this.favour_verify_favour}/${id}`);
  }
}

export interface RedeemFavour {
  imageUrl: string;
  redeemDetails: string;
}
export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  userName: string;
  points: number;
}

export interface Favour {
  _id: string;
  title: string;
  description?: string;
  rewards: string[];
  status: FavourStatus;
  favourType: FavourType;
  isAnonymous: boolean;
  from?: UserInfo | null;
  to?: UserInfo | null;
  proofImage?: string | null;
  proofRequired?: boolean;
  claimedBy?: UserInfo | null;
  claimedAt?: string | null;
  requiredBy?: Date | null;
  additionalNotes?: string;
  requirements?: string[];
  duration?: number;
  durationType?: DurationType;
  __v?: number;
  createdAt: string;
  updatedAt: string;
  priority: PriorityType;
  dueTime: string;
  redeemDetails: string;

  // 🆕 Lifecycle tracking
  verifiedAt?: string | null;
  completedAt?: string | null;
}
export interface CommunityLeaderboard {

  _id: string
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  completedCount: number;
  points: number;
  rank: number;
  rankName: string;
  userName: string;
}
export interface LeaderboardUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  points: number;
  completedCount: number;
  rank: number;
  rankName: string;
  createdCompletedCount: number;
  userName: string
}

export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface Result<T> {
  result: T;
  success: boolean
}

export interface FavourCount {
  iOwe: string
  iOwed: string
  iCompleted: string
  completedForMe: string;
  favoursRequiresVerify: string;
  favoursOtherRequiresVerify: string;
}
