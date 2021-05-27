import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../shared/category.service';
import {CategoryModel} from '../shared/category.model';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {element} from 'protractor';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: CategoryModel[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response: CategoryModel[]) => {
        this.categories = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error(`Erro ao carregar a lista => ${error.status} | ${error.statusText}`);
      }
    });
  }

  deleteCategory(category: CategoryModel): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.categoryService.delete(category).subscribe({
        next: (response) => {
          this.categories = this.categories.filter((element: CategoryModel) => element !== category);
        },
        error: (error: HttpErrorResponse) => {
          alert(`Erro ao deletar elemento da lista => ${error.status} | ${error.statusText}`);
        }
      });
    }
  }

}
