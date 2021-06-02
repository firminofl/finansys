import {AfterContentChecked, Injector, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

import {success, error} from 'toastr';
import {BaseResourceModel} from '../../models/base-resource.model';
import {BaseResourceService} from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string | undefined;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm: boolean;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
    this.pageTitle = '';
    this.serverErrorMessages = [];
    this.submittingForm = false;
    this.resourceForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.loadResource();
    this.buildResourceForm();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  protected createResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource).subscribe({
      next: (response: T) => {
        this.actionsForSuccess(response);
      },
      error: (err: HttpErrorResponse) => {
        this.actionsForError(err);
      }
    });
  }

  protected updateResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    // category.id = Math.floor((Math.random() * 10) + 5);
    this.resourceService.update(resource).subscribe({
      next: (response: T) => {
        this.actionsForSuccess(response);
      },
      error: (err: HttpErrorResponse) => {
        this.actionsForError(err);
      }
    });
  }

  protected actionsForSuccess(resource: T): void {
    success('Solicitação processada com sucesso!', 'Sucesso');

    const urlParent = this.route.snapshot.parent;

    const baseComponentPath = urlParent?.url[0].path ? urlParent?.url[0].path : '';

    // rediret/reaload component page
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    );
  }

  protected actionsForError(err: HttpErrorResponse): void {
    error('Ocorreu um erro ao processar a sua solicitação!', 'Erro');
    this.submittingForm = false;

    if (err.status === 422) {
      this.serverErrorMessages = JSON.parse(err.message).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

  protected setCurrentAction(): void {
    this.route.snapshot.url[0].path === 'new' ? this.currentAction = 'new' : this.currentAction = 'edit';
  }

  protected setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return 'Novo';
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }

  loadResource(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(Number(params.get('id'))))
      )
        .subscribe({
          next: (resource: T) => {
            this.resource = resource;
            this.resourceForm.patchValue(resource); // binds loaded resource data to ResourceForm
          },
          error: (err: HttpErrorResponse) => {
            alert(`Erro ao buscar o elemento da lista => ${err.status} | ${err.statusText}`);
          }
        });
    }
  }

  protected abstract buildResourceForm(): void;
}
