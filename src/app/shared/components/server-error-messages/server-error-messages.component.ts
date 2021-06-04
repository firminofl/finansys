import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-server-error-messages',
  templateUrl: './server-error-messages.component.html',
  styleUrls: ['./server-error-messages.component.scss']
})
export class ServerErrorMessagesComponent implements OnInit {

  // @ts-ignore
  @Input('server-error-messages') serverErrorMessages: Array<string> = null;
  constructor() {
  }

  ngOnInit(): void {
  }

}
