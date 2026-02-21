import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IBrandResponse, IBrandsReponse } from '../models/ibrand';
import { BASE_URL } from '@shared/tokens/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);

  getAllBrands(paginateObj: { currentPage: number, limit: number, sort: string, keyword: string, fields: string }): Observable<IBrandsReponse> {
    return this.httpClient.get<IBrandsReponse>(`${this.baseUrl}/brands?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&keyword=${paginateObj.keyword}&fields=${paginateObj.fields}`)
  }

  getBrand(id: string): Observable<IBrandResponse> {
    return this.httpClient.get<IBrandResponse>(`${this.baseUrl}/brands/${id}`)
  }

  createNewBrand(formData: any): Observable<IBrandResponse> {
    return this.httpClient.post<IBrandResponse>(`${this.baseUrl}/brands`, formData, {
      withCredentials: true
    })
  }

  updateBrand(id: string, formData: any): Observable<IBrandResponse> {
    return this.httpClient.put<IBrandResponse>(`${this.baseUrl}/brands/${id}`, formData, {
      withCredentials: true
    })
  }

  deleteBrand(id: string): Observable<IBrandResponse> {
    return this.httpClient.delete<IBrandResponse>(`${this.baseUrl}/brands/${id}`, {
      withCredentials: true
    })
  }
}
