import {AfterContentChecked, Component, OnInit} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryModel} from '../shared/category.model';
import {CategoryService} from '../shared/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

import {success, error} from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string | undefined;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm: boolean;
  category: CategoryModel = new CategoryModel();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.pageTitle = '';
    this.serverErrorMessages = [];
    this.submittingForm = false;
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  private createCategory(): void {
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);

    category.id = Math.floor((Math.random() * 10) + 5);
    this.categoryService.create(category).subscribe({
      next: (response: CategoryModel) => {
        this.actionsForSuccess(response);
      },
      error: (err: HttpErrorResponse) => {
        this.actionsForError(err);
      }
    });
  }

  private updateCategory(): void {
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);

    category.id = Math.floor((Math.random() * 10) + 5);
    this.categoryService.update(category).subscribe({
      next: (response: CategoryModel) => {
        this.actionsForSuccess(response);
      },
      error: (err: HttpErrorResponse) => {
        this.actionsForError(err);
      }
    });
  }

  private actionsForSuccess(category: CategoryModel): void {
    success('Solicitação processada com sucesso!', 'Sucesso');

    // rediret/reaload component page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  private actionsForError(err: HttpErrorResponse): void {
    error('Ocorreu um erro ao processar a sua solicitação!', 'Erro');
    this.submittingForm = false;

    if (err.status === 422) {
      this.serverErrorMessages = JSON.parse(err.message).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

  private setCurrentAction(): void {
    this.route.snapshot.url[0].path === 'new' ? this.currentAction = 'new' : this.currentAction = 'edit';
  }

  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de nova categoria';
    } else {
      const categoryName = this.category.name || '';

      this.pageTitle = `Editando categoria: ${categoryName}`;
    }
  }

  loadCategory(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(Number(params.get('id'))))
      )
        .subscribe({
          next: (response: CategoryModel) => {
            this.category = response;
            this.categoryForm.patchValue(response); // binds loaded category data to CategoryForm
          },
          error: (err: HttpErrorResponse) => {
            alert(`Erro ao buscar o elemento da lista => ${err.status} | ${err.statusText}`);
          }
        });
    }
  }

  get name(): FormControl {
    return this.categoryForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.categoryForm.get('description') as FormControl;
  }

}
