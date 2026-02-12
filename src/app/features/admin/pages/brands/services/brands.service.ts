import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IBrandData, IBrandResponse, IBrandsReponse } from '../models/ibrand';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(paginateObj: { currentPage: number, limit: number, sort: string, keyword: string, fields: string }): Observable<IBrandsReponse> {
    return this.httpClient.get<IBrandsReponse>(`http://localhost:3000/api/v1/brands?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&keyword=${paginateObj.keyword}&fields=${paginateObj.fields}`)
  }

  getBrand(id: string): Observable<IBrandResponse> {
    return this.httpClient.get<IBrandResponse>(`http://localhost:3000/api/v1/brands/${id}`, {
      withCredentials: true
    })
  }

  createNewBrand(formData: any): Observable<IBrandResponse> {
    return this.httpClient.post<IBrandResponse>(`http://localhost:3000/api/v1/brands`, formData, {
      withCredentials: true
    })
  }

  deleteBrand(id: string): Observable<any> {
    return this.httpClient.delete<any>(`http://localhost:3000/api/v1/brands/${id}`, {
      withCredentials: true
    })
  }
}
