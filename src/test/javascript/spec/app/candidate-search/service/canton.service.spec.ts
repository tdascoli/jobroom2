import { TranslateService } from '@ngx-translate/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { CantonService } from '../../../../../../main/webapp/app/candidate-search/services/canton.service';

describe('CantonService', () => {
    let cantonService: CantonService;

    const mockTranslateService = jasmine.createSpyObj('mockTranslateService', ['stream']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                CantonService,
                { provide: TranslateService, useValue: mockTranslateService }
            ]
        }).compileComponents();

        mockTranslateService.stream.and.callFake((arg) => {
            if (arg === 'global.reference.canton.ZH') {
                return Observable.of('Zurich');
            } else {
                return Observable.of(null);
            }
        });
    }));

    beforeEach(inject([CantonService], (_cantonService_) => {
        cantonService = _cantonService_;
    }));

    it('should return 26 cantons', async(() => {
        cantonService.getCantonOptions().subscribe((options) => {
            expect(options.length).toEqual(26);
        });
    }));

    it('should translate only Zurich canton', async(() => {
        cantonService.getCantonOptions().subscribe((options) => {
            const filteredOptions = options.filter((option) => option.name);
            expect(filteredOptions.length).toEqual(1);
            expect(filteredOptions[0]).toEqual({ id: 'ZH', name: 'Zurich' });
        });
    }));
});
