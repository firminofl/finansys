import {Component, OnInit} from '@angular/core';
import {EntryService} from '../shared/entry.service';
import {EntryModel} from '../shared/entry.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {
  entries: EntryModel[] = [];

  constructor(private entryService: EntryService) {
  }

  ngOnInit(): void {
    this.getAllEntries();
  }

  getAllEntries(): void {
    this.entryService.getAll().subscribe({
      next: (response: EntryModel[]) => {
        this.entries = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error(`Erro ao carregar a lista => ${error.status} | ${error.statusText}`);
      }
    });
  }

  deleteEntry(entry: EntryModel): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.entryService.delete(entry).subscribe({
        next: (response) => {
          this.entries = this.entries.filter((element: EntryModel) => element !== entry);
        },
        error: (error: HttpErrorResponse) => {
          alert(`Erro ao deletar elemento da lista => ${error.status} | ${error.statusText}`);
        }
      });
    }
  }

}
