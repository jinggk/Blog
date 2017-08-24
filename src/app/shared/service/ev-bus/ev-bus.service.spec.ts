import { TestBed, inject } from '@angular/core/testing';

import { EvBusService } from './ev-bus.service';

describe('EvBusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvBusService]
    });
  });

  it('should be created', inject([EvBusService], (service: EvBusService) => {
    expect(service).toBeTruthy();
  }));
});
