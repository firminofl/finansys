import {Component} from '@angular/core';
import {EntryService} from '../shared/entry.service';
import {EntryModel} from '../shared/entry.model';
import {BaseResourceListComponent} from '../../../shared/components/base-resource-list/base-resource-list-component';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent extends BaseResourceListComponent<EntryModel> {
  constructor(protected entryService: EntryService) {
    super(entryService);
  }
}
