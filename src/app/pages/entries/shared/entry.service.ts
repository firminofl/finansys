import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {flatMap} from 'rxjs/operators';
import {EntryModel} from './entry.model';
import {CategoryService} from '../../categories/shared/category.service';
import {BaseResourceService} from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<EntryModel> {

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService) {
    super(`${environment.baseUrl}/entries`, injector);
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      flatMap(category => {
        entry.category = category;

        return super.create(entry);
      })
    );
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      flatMap(category => {
        entry.category = category;

        return super.update(entry);
      })
    );
  }

  // protected methods

  protected jsonDataToResources(jsonData: any[]): EntryModel[] {
    const entries: EntryModel[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new EntryModel(), element);
      entries.push(entry);
    });
    return entries;
  }

  protected jsonDataToResource(jsonData: any): EntryModel {
    return Object.assign(new EntryModel(), jsonData);
  }
}
