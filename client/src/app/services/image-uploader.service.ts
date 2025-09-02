import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpService, RequestMethod } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploaderService {
  private readonly uploadImageUrl = `${environment.apiUrl}/utils/upload-profile-picture`;
  private readonly removeImageUrl = `${environment.apiUrl}/utils/delete-profile-picture`;
  private httpClient = inject(HttpClient);
  private httpService = inject(HttpService);


  uploadPicture(file: File, name: string) {
    const formData = new FormData();
    formData.append('image', file, name);
    return this.httpClient.post<UploadResponse>(this.uploadImageUrl, formData, {
      withCredentials: true
    });
  }


  removePicture(name: string) {
    return this.httpClient.post<DeleteResponse>(this.removeImageUrl, {
      body: { name }
    }, {
      withCredentials: true
    });
  }

  deleteProfilePicture(name: string): Observable<DeleteResponse> {
    return this.httpClient.request<DeleteResponse>('delete', `${this.removeImageUrl}`, {
      body: { name }
    });
  }

}

export interface UploadResponse {
  imageUrl: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
