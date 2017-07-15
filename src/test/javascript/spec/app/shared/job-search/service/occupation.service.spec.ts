import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { Response, ResponseOptions } from '@angular/http';
import { JobroomTestModule } from '../../../../test.module';
import {
    InputType,
    OccupationAutocomplete,
    OccupationService,
    TypeaheadMultiselectModel
} from '../../../../../../../main/webapp/app/shared/job-search';
import arrayContaining = jasmine.arrayContaining;

describe('OccupationService', () => {

    const createJsonResponse = (obj: any) => new Response(new ResponseOptions({ body: JSON.stringify(obj) }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            providers: [
                OccupationService,
                { provide: TranslateService, useValue: { currentLang: 'de' } }
            ]
        });
    });

    describe('fetchSuggestions', () => {
        let lastConnection;

        beforeEach(inject([MockBackend], (mockBackend: MockBackend) => {
            mockBackend.connections.subscribe((connection: any) => lastConnection = connection);
        }));

        it('should call http.get with the correct URL and parameters',
            inject([OccupationService], (service: OccupationService) => {

                // WHEN
                service.fetchSuggestions('info');

                // THEN
                const urlArray = lastConnection.request.url.split(/[?&]/);
                expect(urlArray).toEqual(arrayContaining(['referenceservice/api/_search/occupations']));
                expect(urlArray).toEqual(arrayContaining(['prefix=info']));
                expect(urlArray).toEqual(arrayContaining(['responseSize=10']));
                expect(urlArray).toEqual(arrayContaining(['language=de']));
            }));

        it('should map the OccupationAutocomplete response to an array of TypeaheadMultiselectModel',
            fakeAsync(inject([OccupationService], (service: OccupationService) => {
                // GIVEN
                const suggestResponse: OccupationAutocomplete = {
                    occupations: [
                        { code: '00', name: 'Informatiker' },
                        { code: '01', name: 'Bioinformatiker' },
                        { code: '02', name: 'Wirtschaftinformatiker' },
                    ]
                };

                // WHEN
                let model: Array<TypeaheadMultiselectModel>;
                service.fetchSuggestions('info').subscribe((res: any) => model = res);
                lastConnection.mockRespond(createJsonResponse(suggestResponse));
                tick();

                // THEN
                expect(model.length).toEqual(3);
                expect(model).toEqual([
                    new TypeaheadMultiselectModel(InputType.OCCUPATION, '00', 'Informatiker', 0),
                    new TypeaheadMultiselectModel(InputType.OCCUPATION, '01', 'Bioinformatiker', 0),
                    new TypeaheadMultiselectModel(InputType.OCCUPATION, '02', 'Wirtschaftinformatiker', 0)
                ]);
            })));
    });
});
