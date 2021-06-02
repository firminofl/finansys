import {AfterContentChecked, Component, Injector, OnInit} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryModel} from '../shared/category.model';
import {CategoryService} from '../shared/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

import {success, error} from 'toastr';
import {BaseResourceFormComponent} from '../../../shared/components/base-resource-form/base-resource-form-component';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent extends BaseResourceFormComponent<CategoryModel> {

  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new CategoryModel(), categoryService, CategoryModel.fromJson);
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Nova Categoria';
  }

  protected editionPageTitle(): string {
    const categoryName = this.resource.name || '';
    return `Editando Categoria: ${categoryName}`;
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }
}
