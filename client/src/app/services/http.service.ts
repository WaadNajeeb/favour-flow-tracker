import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  public request<TResponse = unknown>(method: RequestMethod, endpoint: string, data?: any): Observable<TResponse> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    switch (method) {
      case RequestMethod.DELETE:
        return this.httpClient.delete<TResponse>(endpoint, options);
      case RequestMethod.GET:
        return this.httpClient.get<TResponse>(endpoint, options);
      case RequestMethod.PATCH:
        return this.httpClient.patch<TResponse>(endpoint, data, options);
      case RequestMethod.POST:
        return this.httpClient.post<TResponse>(endpoint, data, options);
      case RequestMethod.PUT:
        return this.httpClient.put<TResponse>(endpoint, data, options);
    }
  }
}


export enum RequestMethod {
  DELETE,
  GET,
  PATCH,
  POST,
  PUT
}
