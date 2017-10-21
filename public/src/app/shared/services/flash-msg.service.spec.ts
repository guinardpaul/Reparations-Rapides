import { TestBed, inject } from '@angular/core/testing';

import { FlashMsgService } from './flash-msg.service';

describe('FlashMsgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlashMsgService]
    });
  });

  it('should be created', inject([FlashMsgService], (service: FlashMsgService) => {
    expect(service).toBeTruthy();
  }));
});
