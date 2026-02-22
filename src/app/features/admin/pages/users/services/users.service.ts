import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '@shared/tokens/api-url.token';
import { IUserResponse, IUsersResponse } from '../models/iuser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);

  getAllUsers(paginateObj: { currentPage: number, limit: number, sort: string, fields: string }): Observable<IUsersResponse> {
    return this.httpClient.get<IUsersResponse>(`${this.baseUrl}/users?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&fields=${paginateObj.fields}`, {
      withCredentials: true
    })
  }

  getUser(id: string): Observable<IUserResponse> {
    return this.httpClient.get<IUserResponse>(`${this.baseUrl}/users/${id}`, {
      withCredentials: true
    });
  }

  createNewUser(formData: any): Observable<IUserResponse> {
    return this.httpClient.post<IUserResponse>(`${this.baseUrl}/users`, formData, {
      withCredentials: true
    })
  }

  updateUser(id: string, formData: any): Observable<IUserResponse> {
    return this.httpClient.put<IUserResponse>(`${this.baseUrl}/users/${id}`, formData, {
      withCredentials: true
    })
  }

  deleteUser(id: string): Observable<IUserResponse> {
    return this.httpClient.delete<IUserResponse>(`${this.baseUrl}/users/${id}`, {
      withCredentials: true
    })
  }

  changeUserStatus(id: string, active: boolean): Observable<IUserResponse> {
    return this.httpClient.put<IUserResponse>(`${this.baseUrl}/users/changeStatus/${id}`, { active }, {
      withCredentials: true
    })
  }
}
