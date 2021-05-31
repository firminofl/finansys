import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, flatMap, map} from 'rxjs/operators';
import {EntryModel} from './entry.model';
import {CategoryService} from '../../categories/shared/category.service';
import {CategoryModel} from '../../categories/shared/category.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService) {
  }

  private static handleError(error: any): Observable<any> {
    console.error(`Erro na requisição -> ${error}`);
    return throwError(error);
  }

  getAll(): Observable<EntryModel[]> {
    return this.http.get(`${environment.baseUrl}/entries`).pipe(
      catchError(EntryService.handleError),
      map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<EntryModel> {
    return this.http.get(`${environment.baseUrl}/entries/${id}`).pipe(
      catchError(EntryService.handleError),
      map(this.jsonDataToCategory)
    );
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      flatMap(category => {
        entry.category = category;
        return this.http.post(`${environment.baseUrl}/entries`, entry).pipe(
          catchError(EntryService.handleError),
          map(() => entry)
        );
      })
    );
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      flatMap(category => {
        entry.category = category;
        return this.http.put(`${environment.baseUrl}/entries/${entry.id}`, entry).pipe(
          catchError(EntryService.handleError),
          map(this.jsonDataToCategory)
        );
      })
    );
  }

  delete(entry: EntryModel): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/entries/${entry.id}`).pipe(
      catchError(EntryService.handleError),
      map(() => null)
    );
  }

  private jsonDataToEntries(jsonData: any[]): EntryModel[] {
    const entries: EntryModel[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new EntryModel(), element);
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToCategory(jsonData: any): EntryModel {
    return Object.assign(new EntryModel(), jsonData);
  }
}
