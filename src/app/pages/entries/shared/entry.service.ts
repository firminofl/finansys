import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, flatMap, map} from 'rxjs/operators';
import {EntryModel} from './entry.model';
import {CategoryService} from '../../categories/shared/category.service';
import {BaseResourceService} from '../../../shared/services/base-resource.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<EntryModel> {

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService) {
    super(
      `${environment.baseUrl}/entries`,
      injector,
      EntryModel.fromJson
    );
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  getMonthByYear(month: number, year: number): Observable<EntryModel[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    );
  }

  // @ts-ignore
  private filterByMonthAndYear = (entries: EntryModel[], month: number, year: number) => entries.filter(entry => {
    const entryDate = moment(entry.date, 'DD/MM/YYYY');
    const monthMatches = entryDate.month() + 1 === month;
    const yearMatches = entryDate.year() === year;

    if (monthMatches && yearMatches) {
      return entry;
    }
  })

  private setCategoryAndSendToServer(entry: EntryModel, sendFn: any): Observable<any> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      flatMap(category => {
        entry.category = category;

        return sendFn(entry);
      }),
      catchError(this.handleError)
    );
  }
}
