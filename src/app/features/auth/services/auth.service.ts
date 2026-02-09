import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface IAuthResponse {
  token: string;
  data: {
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    _id: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  login(formData: any): Observable<IAuthResponse> {
    return this.httpClient.post<IAuthResponse>(`http://localhost:3000/api/v1/auth/login`, formData, {
      withCredentials: true
    })
  }
}
