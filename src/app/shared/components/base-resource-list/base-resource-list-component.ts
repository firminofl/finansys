import {Component, Directive, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {BaseResourceModel} from '../../models/base-resource.model';
import {BaseResourceService} from '../../services/base-resource.service';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {
  resources: T[] = [];

  constructor(protected resourceService: BaseResourceService<T>) {
  }

  ngOnInit(): void {
    this.getAllResources();
  }

  getAllResources(): void {
    this.resourceService.getAll().subscribe({
      next: (response: T[]) => {
        this.resources = response.sort((a: T, b: T) => {
          const first = a.id ? a.id : 0;
          const second = b.id ? b.id : 0;

          return second - first;
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Erro ao carregar a lista`);
      }
    });
  }

  deleteResource(resource: T): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.resourceService.delete(resource).subscribe({
        next: (response: T) => {
          this.resources = this.resources.filter((element: T) => element !== resource);
        },
        error: (err: HttpErrorResponse) => {
          alert(`Erro ao deletar elemento da lista => ${err.status} | ${err.statusText}`);
        }
      });
    }
  }

}
