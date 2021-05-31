import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CategoriesRoutingModule} from './categories-routing.module';
import {CategoryListComponent} from './category-list/category-list.component';
import {CategoryFormComponent} from './category-form/category-form.component';
import {CategoryService} from './shared/category.service';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [CategoryListComponent, CategoryFormComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CategoryService,
    FormBuilder
  ]
})
export class CategoriesModule {
}