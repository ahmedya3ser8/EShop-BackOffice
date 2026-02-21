import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICategoriesReponse, ICategoryResponse } from '../models/icategory';
import { BASE_URL } from '@shared/tokens/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);

  getAllCategories(paginateObj: { currentPage: number, limit: number, sort: string, keyword: string, fields: string }): Observable<ICategoriesReponse> {
    return this.httpClient.get<ICategoriesReponse>(`${this.baseUrl}/categories?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&keyword=${paginateObj.keyword}&fields=${paginateObj.fields}`)
  }

  getCategory(id: string): Observable<ICategoryResponse> {
    return this.httpClient.get<ICategoryResponse>(`${this.baseUrl}/categories/${id}`);
  }

  createNewCategory(formData: any): Observable<ICategoryResponse> {
    return this.httpClient.post<ICategoryResponse>(`${this.baseUrl}/categories`, formData, {
      withCredentials: true
    })
  }

  updateCategory(id: string, formData: any): Observable<ICategoryResponse> {
    return this.httpClient.put<ICategoryResponse>(`${this.baseUrl}/categories/${id}`, formData, {
      withCredentials: true
    })
  }

  deleteCategory(id: string): Observable<ICategoryResponse> {
    return this.httpClient.delete<ICategoryResponse>(`${this.baseUrl}/categories/${id}`, {
      withCredentials: true
    })
  }
}
