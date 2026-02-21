import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ISubCategoriesReponse, ISubCategoryResponse } from '../models/isubcategory';
import { BASE_URL } from '@shared/tokens/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);

  getAllSubCategories(paginateObj: { currentPage: number, limit: number, sort: string, keyword: string, fields: string }): Observable<ISubCategoriesReponse> {
    return this.httpClient.get<ISubCategoriesReponse>(`${this.baseUrl}/subcategories?page=${paginateObj.currentPage}&limit=${paginateObj.limit}&sort=${paginateObj.sort}&keyword=${paginateObj.keyword}&fields=${paginateObj.fields}`)
  }

  getSubCategory(id: string): Observable<ISubCategoryResponse> {
    return this.httpClient.get<ISubCategoryResponse>(`${this.baseUrl}/subcategories/${id}`);
  }

  createNewSubCategory(formData: any): Observable<ISubCategoryResponse> {
    return this.httpClient.post<ISubCategoryResponse>(`${this.baseUrl}/subcategories`, formData, {
      withCredentials: true
    })
  }

  updateSubCategory(id: string, formData: any): Observable<ISubCategoryResponse> {
    return this.httpClient.put<ISubCategoryResponse>(`${this.baseUrl}/subcategories/${id}`, formData, {
      withCredentials: true
    })
  }

  deleteSubCategory(id: string): Observable<ISubCategoryResponse> {
    return this.httpClient.delete<ISubCategoryResponse>(`${this.baseUrl}/subcategories/${id}`, {
      withCredentials: true
    })
  }
}
