import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BASE_URL } from '@shared/tokens/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);

  getAllUsers(paginateObj: { currentPage: number, limit: number, sort: string, fields: string }): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/users?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&fields=${paginateObj.fields}`, {
      withCredentials: true
    })
  }

  getUser(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/users/${id}`, {
      withCredentials: true
    });
  }

  createNewUser(formData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/users`, formData, {
      withCredentials: true
    })
  }

  updateUser(id: string, formData: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/users/${id}`, formData, {
      withCredentials: true
    })
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/users/${id}`, {
      withCredentials: true
    })
  }

  changeUserStatus(id: string, active: boolean): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/users/changeStatus/${id}`, { active }, {
      withCredentials: true
    })
  }
}
