import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IBrandResponse, IBrandsReponse } from '../models/ibrand';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(paginateObj: { currentPage: number, limit: number, sort: string, keyword: string, fields: string }): Observable<IBrandsReponse> {
    return this.httpClient.get<IBrandsReponse>(`http://localhost:3000/api/v1/brands?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&keyword=${paginateObj.keyword}&fields=${paginateObj.fields}`)
  }

  getBrand(id: string): Observable<IBrandResponse> {
    return this.httpClient.get<IBrandResponse>(`http://localhost:3000/api/v1/brands/${id}`)
  }

  createNewBrand(formData: any): Observable<IBrandResponse> {
    return this.httpClient.post<IBrandResponse>(`http://localhost:3000/api/v1/brands`, formData, {
      withCredentials: true
    })
  }

  updateBrand(id: string, formData: any): Observable<IBrandResponse> {
    return this.httpClient.put<IBrandResponse>(`http://localhost:3000/api/v1/brands/${id}`, formData, {
      withCredentials: true
    })
  }

  deleteBrand(id: string): Observable<IBrandResponse> {
    return this.httpClient.delete<IBrandResponse>(`http://localhost:3000/api/v1/brands/${id}`, {
      withCredentials: true
    })
  }
}
