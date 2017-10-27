import { Injectable } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

/**
 * Flash Msg
 * @author Paul GUINARD
 * @export FlashMsgService
 * @class FlashMsgService
 */
@Injectable()
export class FlashMsgService {

  /**
   * Creates an instance of FlashMsgService.
   * @param {FlashMessagesService} flashMsg flash Messages Service
   * @memberof FlashMsgService
   */
  constructor(
    private flashMsg: FlashMessagesService
  ) { }

  /**
   * Envoi un flash Msg
   *
   * @param {string} message message
   * @param {string} cssClass class css
   * @param {number} timeout timeout
   * @memberof FlashMsgService
   */
  displayMsg(message: string, cssClass: string, timeout: number) {
    this.flashMsg.show(message, {
      cssClass: cssClass,
      timeout: timeout
    });
  }

}
