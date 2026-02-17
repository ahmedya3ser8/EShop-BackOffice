import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICategoriesReponse, ICategoryResponse } from '../models/icategory';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories(paginateObj: { currentPage: number, limit: number, sort: string, keyword: string, fields: string }): Observable<ICategoriesReponse> {
    return this.httpClient.get<ICategoriesReponse>(`http://localhost:3000/api/v1/categories?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&keyword=${paginateObj.keyword}&fields=${paginateObj.fields}`)
  }

  getCategory(id: string): Observable<ICategoryResponse> {
    return this.httpClient.get<ICategoryResponse>(`http://localhost:3000/api/v1/categories/${id}`);
  }

  createNewCategory(formData: any): Observable<ICategoryResponse> {
    return this.httpClient.post<ICategoryResponse>(`http://localhost:3000/api/v1/categories`, formData, {
      withCredentials: true
    })
  }

  updateCategory(id: string, formData: any): Observable<ICategoryResponse> {
    return this.httpClient.put<ICategoryResponse>(`http://localhost:3000/api/v1/categories/${id}`, formData, {
      withCredentials: true
    })
  }

  deleteCategory(id: string): Observable<ICategoryResponse> {
    return this.httpClient.delete<ICategoryResponse>(`http://localhost:3000/api/v1/categories/${id}`, {
      withCredentials: true
    })
  }
}
