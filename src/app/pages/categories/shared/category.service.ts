import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError, flatMap} from 'rxjs/operators';

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
    return this.http.get(environment.baseUrl).pipe(
      catchError(CategoryService.handleError),
      map(this.jsonDataToCategories)
    );
  }

  getById(id: number): Observable<CategoryModel> {
    return this.http.get(`${environment.baseUrl}/${id}`).pipe(
      catchError(CategoryService.handleError),
      map(this.jsonDataToCategory)
    );
  }

  create(category: CategoryModel): Observable<any> {
    return this.http.post(environment.baseUrl, category).pipe(
      catchError(CategoryService.handleError),
      map(() => category)
    );
  }

  update(category: CategoryModel): Observable<CategoryModel> {
    return this.http.put(`${environment.baseUrl}/${category.id}`, category).pipe(
      catchError(CategoryService.handleError),
      map(this.jsonDataToCategory)
    );
  }

  delete(category: CategoryModel): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/${category.id}`).pipe(
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
