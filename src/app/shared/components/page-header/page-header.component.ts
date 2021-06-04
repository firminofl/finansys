import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  @Input('page-title') pageTitle = '';
  @Input('button-class') buttonClass = '';
  @Input('button-text') buttonText = '';
  @Input('button-link') buttonLink = '';
  @Input('button-show') buttonShow = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
