import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {CategoryModel} from '../../categories/shared/category.model';
import {EntryModel} from '../../entries/shared/entry.model';
import {EntryService} from '../../entries/shared/entry.service';
import {CategoryService} from '../../categories/shared/category.service';
import {HttpErrorResponse} from '@angular/common/http';

// @ts-ignore
import currencyFormatter from 'currency-formatter';
import {warning, error} from 'toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    tooltips: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        },
        stacked: true
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        stacked: true
      }]
    }
  };

  categories: CategoryModel[] = [];
  entries: EntryModel[] = [];

  // @ts-ignore
  @ViewChild('month') month: ElementRef = null;
  // @ts-ignore
  @ViewChild('year') year: ElementRef = null;

  constructor(
    private entryService: EntryService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (response: CategoryModel[]) => {
        this.categories = response;
      },
      error: (err: HttpErrorResponse) => {
        error('Não foi possível buscar as categorias.', `Erro ${err.status}`);
      }
    });
  }

  generateReports(): void {
    const month = Number(this.month.nativeElement.value);
    const year = Number(this.year.nativeElement.value);

    if (!month || !year) {
      warning('Selecione o Mẽs e Ano.', `Atenção!`);
      return;
    }

    this.entryService.getMonthByYear(month, year).subscribe({
      next: (response: EntryModel[]) => {
        this.setValues(response);
      },
      error: (err: HttpErrorResponse) => {
        error('Não foi possível buscar as categorias.', `Erro ${err.status}`);
      }
    });
  }

  private setValues(entries: EntryModel[]): void {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance(): void {
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if (entry.type === 'revenue') {
        revenueTotal += currencyFormatter.unformat(entry.amount, {
          code: 'BRL'
        });
      }

      if (entry.type === 'expense') {
        expenseTotal += currencyFormatter.unformat(entry.amount, {
          code: 'BRL'
        });
      }
    });

    this.expenseTotal = currencyFormatter.format(expenseTotal, {
      code: 'BRL'
    });

    this.revenueTotal = currencyFormatter.format(revenueTotal, {
      code: 'BRL'
    });

    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, {
      code: 'BRL'
    });
  }

  private setChartData(): void {
    this.revenueChartData = this.getChartData('revenue', '#9CCC65', 'Gráfico de Receitas');
    this.expenseChartData = this.getChartData('expense', '#E03131', 'Gráfico de Despesas');
  }

  private getChartData(entryType: string, chartBackGroundColor: string, title: string): any {
    const chartData: Array<any> = [];

    this.categories.forEach(categorie => {
      // filtering entries by category and type
      const filteredEntries: EntryModel[] = this.entries.filter(entry => (entry.categoryId === categorie.id) && (entry.type === entryType)
      );

      // if found entries then sum entries amount and add to chartData
      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce((total, entry) => total + currencyFormatter.unformat(entry.amount, {
          code: 'BRL'
        }), 0);

        chartData.push({
          categoryName: categorie.name,
          totalAmount
        });
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: chartBackGroundColor,
        data: chartData.map((item) => item.totalAmount)
      }]
    };
  }

}
