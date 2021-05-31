import {AfterContentChecked, Component, OnInit} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EntryModel} from '../shared/entry.model';
import {EntryService} from '../shared/entry.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

import {success, error} from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string | undefined;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm: boolean;
  entry: EntryModel = new EntryModel();

  constructor(
    private entryService: EntryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.pageTitle = '';
    this.serverErrorMessages = [];
    this.submittingForm = false;
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  private createEntry(): void {
    const entry: EntryModel = Object.assign(new EntryModel(), this.entryForm.value);

    entry.id = Math.floor((Math.random() * 10) + 5);
    this.entryService.create(entry).subscribe({
      next: (response: EntryModel) => {
        this.actionsForSuccess(response);
      },
      error: (err: HttpErrorResponse) => {
        this.actionsForError(err);
      }
    });
  }

  private updateEntry(): void {
    const entry: EntryModel = Object.assign(new EntryModel(), this.entryForm.value);

    entry.id = Math.floor((Math.random() * 10) + 5);
    this.entryService.update(entry).subscribe({
      next: (response: EntryModel) => {
        this.actionsForSuccess(response);
      },
      error: (err: HttpErrorResponse) => {
        this.actionsForError(err);
      }
    });
  }

  private actionsForSuccess(entry: EntryModel): void {
    success('Solicitação processada com sucesso!', 'Sucesso');

    // rediret/reaload component page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', entry.id, 'edit'])
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
      this.pageTitle = 'Cadastro de novo lançamento';
    } else {
      const entryName = this.entry.name || '';

      this.pageTitle = `Editando lançamento: ${entryName}`;
    }
  }

  loadEntry(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(Number(params.get('id'))))
      )
        .subscribe({
          next: (response: EntryModel) => {
            this.entry = response;
            this.entryForm.patchValue(response); // binds loaded entry data to EntryForm
          },
          error: (err: HttpErrorResponse) => {
            alert(`Erro ao buscar o elemento da lista => ${err.status} | ${err.statusText}`);
          }
        });
    }
  }

  get name(): FormControl {
    return this.entryForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.entryForm.get('description') as FormControl;
  }

  get type(): FormControl {
    return this.entryForm.get('type') as FormControl;
  }

  get amount(): FormControl {
    return this.entryForm.get('amount') as FormControl;
  }

  get date(): FormControl {
    return this.entryForm.get('date') as FormControl;
  }

  get paid(): FormControl {
    return this.entryForm.get('paid') as FormControl;
  }

  get categoryId(): FormControl {
    return this.entryForm.get('categoryId') as FormControl;
  }
}