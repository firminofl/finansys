import {InMemoryDbService} from 'angular-in-memory-web-api';
import {CategoryModel} from './pages/categories/shared/category.model';
import {EntryModel} from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb(): { categories: CategoryModel[], entries: EntryModel[] } {
    const categories: CategoryModel[] = [
      {id: 1, name: 'Moradia', description: 'Pagamentos de Contas da Casa'},
      {id: 2, name: 'Saúde', description: 'Plano de Saúde e Remédios'},
      {id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc...'},
      {id: 4, name: 'Salário', description: 'Recebimento de Salário'},
      {id: 5, name: 'Freelas', description: 'Trabalhos como freelancer'},
    ];

    const entries: EntryModel[] = [
      {
        id: 1, name: 'Gás de Cozinha', description: 'Descrição qualquer do item', type: 'expense',
        amount: '70,36', date: '14/10/2019', paid: true, categoryId: categories[0].id,
        category: categories[0]
      } as EntryModel,
      {
        id: 2, name: 'Salário da Empresa X', description: '', type: 'revenue',
        amount: '10.000,00', date: '05/10/2019', paid: false, categoryId: categories[1].id,
        category: categories[1]
      } as EntryModel];

    return {categories, entries};
  }
}
