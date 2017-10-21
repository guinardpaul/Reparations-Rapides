import { Injectable } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class FlashMsgService {

  constructor(
    private flashMsg: FlashMessagesService
  ) { }

  displayMsg(message: string, cssClass: string, timeout: number) {
    this.flashMsg.show(message, {
      cssClass: cssClass,
      timeout: timeout
    });
  }

}
