import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseResourceService} from '../../../shared/services/base-resource.service';
import {CategoryModel} from './category.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<CategoryModel> {
  constructor(protected injector: Injector) {
    super(`${environment.baseUrl}/categories`, injector);
  }
}
