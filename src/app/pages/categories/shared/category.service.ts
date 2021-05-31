import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import {CategoryModel} from './category.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {
  }

  private static handleError(error: any): Observable<any> {
    console.error(`Erro na requisição -> ${error}`);
    return throwError(error);
  }

  getAll(): Observable<CategoryModel[]> {
    return this.http.get(`${environment.baseUrl}/categories`).pipe(
      catchError(CategoryService.handleError),
      map(this.jsonDataToCategories)
    );
  }

  getById(id: number): Observable<CategoryModel> {
    return this.http.get(`${environment.baseUrl}/categories/${id}`).pipe(
      catchError(CategoryService.handleError),
      map(this.jsonDataToCategory)
    );
  }

  create(category: CategoryModel): Observable<CategoryModel> {
    return this.http.post(`${environment.baseUrl}/categories`, category).pipe(
      catchError(CategoryService.handleError),
      map(() => category)
    );
  }

  update(category: CategoryModel): Observable<CategoryModel> {
    return this.http.put(`${environment.baseUrl}/categories/${category.id}`, category).pipe(
      catchError(CategoryService.handleError),
      map(this.jsonDataToCategory)
    );
  }

  delete(category: CategoryModel): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/categories/${category.id}`).pipe(
      catchError(CategoryService.handleError),
      map(() => null)
    );
  }

  private jsonDataToCategories(jsonData: any[]): CategoryModel[] {
    const categories: CategoryModel[] = [];

    jsonData.forEach(element => categories.push((element as CategoryModel)));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): CategoryModel {
    return jsonData as CategoryModel;
  }
}
