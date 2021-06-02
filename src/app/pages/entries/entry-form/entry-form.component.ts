import {AfterContentChecked, Component, Injector, OnInit} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EntryModel} from '../shared/entry.model';
import {EntryService} from '../shared/entry.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

import {success, error} from 'toastr';
import {LocaleSettings} from 'primeng/calendar';
import {CategoryModel} from '../../categories/shared/category.model';
import {CategoryService} from '../../categories/shared/category.service';
import {BaseResourceFormComponent} from '../../../shared/components/base-resource-form/base-resource-form-component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent extends BaseResourceFormComponent<EntryModel> implements OnInit {

  imaskConfig = {
    mask: Number,  // enable number mask

    // other options are optional with defaults below
    scale: 2,  // digits after point, 0 for integers
    thousandsSeparator: '',  // any single char
    padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
    normalizeZeros: true,  // appends or removes zeros at ends
    radix: ',',  // fractional delimiter
  };

  ptBR: LocaleSettings = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago',
      'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  categories: CategoryModel[] = [];

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new EntryModel(), entryService, EntryModel.fromJson);
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    super.ngOnInit();
  }

  get typeOptions(): Array<any> {
    return Object.entries(EntryModel.types).map(([key, value]) => {
      return {
        key,
        value
      };
    });
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Novo Lançamento';
  }

  protected editionPageTitle(): string {
    const resourceName = this.resource.name || '';
    return `Editando Lançamento: ${resourceName}`;
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response: CategoryModel[]) => {
        this.categories = response;
      },
      error: (err: HttpErrorResponse) => {
        alert(`Erro ao buscar as categorias => ${err.status} | ${err.statusText}`);
      }
    });
  }

  get name(): FormControl {
    return this.resourceForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.resourceForm.get('description') as FormControl;
  }

  get type(): FormControl {
    return this.resourceForm.get('type') as FormControl;
  }

  get amount(): FormControl {
    return this.resourceForm.get('amount') as FormControl;
  }

  get date(): FormControl {
    return this.resourceForm.get('date') as FormControl;
  }

  get paid(): FormControl {
    return this.resourceForm.get('paid') as FormControl;
  }

  get categoryId(): FormControl {
    return this.resourceForm.get('categoryId') as FormControl;
  }
}
