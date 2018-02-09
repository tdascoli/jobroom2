import {
    GenderAwareOccupationLabel, OccupationInputType,
    OccupationPresentationService
} from '../../../../../../main/webapp/app/shared/reference-service/occupation-presentation.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../../../../../../main/webapp/app/shared/input-components/typeahead/typeahead-multiselect-model';
import {
    OccupationLabel, OccupationLabelAutocomplete,
    OccupationLabelSuggestion
} from '../../../../../../main/webapp/app/shared/reference-service/occupation-label.service';

describe('OccupationPresentationService', () => {
    let sut,
        mockOccupationLabelService,
        mockTranslateService
    ;

    beforeEach(() => {
        mockOccupationLabelService = jasmine.createSpyObj('mockOccupationLabelService',
            ['getOccupationLabelsByKey', 'suggestOccupation']
        );
        mockTranslateService = { currentLang: 'de', onLangChange: Observable.empty() } as TranslateService;
        sut = new OccupationPresentationService(mockOccupationLabelService);
    });

    describe('findOccupationLabelsByBFSCode', () => {
        it('should map parameter to bfs code string', () => {
            // given
            mockOccupationLabelService.getOccupationLabelsByKey.and.returnValue(Observable.of({
                f: 'female label',
                m: 'male label'
            }));

            // when
            let labels: GenderAwareOccupationLabel;
            sut.findOccupationLabelsByBFSCode(11).subscribe((l: GenderAwareOccupationLabel) => labels = l);

            // then
            expect(mockOccupationLabelService.getOccupationLabelsByKey).toHaveBeenCalledWith('bfs:11');
        });
    });

    describe('findOccupationLabelsByAvamCode', () => {
        it('should map parameter to avam code string', () => {
            // given
            mockOccupationLabelService.getOccupationLabelsByKey.and.returnValue(Observable.of({
                f: 'female label',
                m: 'male label'
            }));

            // when
            let labels: GenderAwareOccupationLabel;
            sut.findOccupationLabelsByAvamCode(11).subscribe((l: GenderAwareOccupationLabel) => labels = l);

            // then
            expect(mockOccupationLabelService.getOccupationLabelsByKey).toHaveBeenCalledWith('avam:11');
        });
    });

    describe('findOccupationLabelsByCode', () => {
        it('should map to GenderAwareOccupationLabel', () => {
            // given
            mockOccupationLabelService.getOccupationLabelsByKey.and.returnValue(Observable.of({
                default: 'male/female label',
                f: 'female label',
                m: 'male label'
            }));

            // when
            let labels: GenderAwareOccupationLabel;
            sut.findOccupationLabelsByCode('avam:11').subscribe((l: GenderAwareOccupationLabel) => labels = l);

            // then
            expect(labels).toEqual({
                default: 'male/female label',
                female: 'female label',
                male: 'male label'
            })
        });

        it('should cache occupationLabelService response', () => {
            // given
            mockOccupationLabelService.getOccupationLabelsByKey.and.returnValue(Observable.of({
                default: 'male/female label',
                f: 'female label',
                m: 'male label'
            }));

            // when
            let labels: GenderAwareOccupationLabel;
            sut.findOccupationLabelsByCode('avam:11').subscribe((l: GenderAwareOccupationLabel) => labels = l);
            sut.findOccupationLabelsByCode('avam:11').subscribe((l: GenderAwareOccupationLabel) => labels = l);

            expect(mockOccupationLabelService.getOccupationLabelsByKey.calls.count()).toEqual(1);
        });
    });

    describe('fetchJobSearchOccupationSuggestions', () => {
        it('should call suggestOccupation with the correct parameters', () => {
            // given
            mockOccupationLabelService.suggestOccupation.and.returnValue(Observable.of({
                occupations: [],
                classifications: []
            }));

            // when
            sut.fetchJobSearchOccupationSuggestions('java').subscribe((c) => {
            });

            // then
            expect(mockOccupationLabelService.suggestOccupation).toHaveBeenCalledWith('java', ['x28', 'sbn3', 'sbn5']);
        });

        it('should map suggestion to TypeaheadMultiselectModel[]', () => {
            // given
            const suggestResponse: OccupationLabelAutocomplete = {
                occupations: [
                    {
                        id: '10',
                        code: 10,
                        label: 'Informatiker',
                        type: 'avam',
                        mappings: null,
                        classifier: '',
                        language: 'de'
                    } as OccupationLabelSuggestion,
                    {
                        id: '20',
                        code: 20,
                        label: 'Bioinformatiker',
                        type: 'x28',
                        mappings: null,
                        classifier: '',
                        language: 'de'
                    } as OccupationLabelSuggestion,
                    {
                        id: '30',
                        code: 30,
                        label: 'Wirtschaftinformatiker',
                        type: 'x28',
                        mappings: { 'avam': 111 },
                        classifier: '',
                        language: 'de'
                    } as OccupationLabelSuggestion,
                ],
                classifications: [
                    {
                        id: '300',
                        code: 300,
                        label: 'Berufe der Informatik',
                        type: 'sbn3',
                        classifier: '',
                        language: 'de'
                    } as OccupationLabel
                ]
            };
            mockOccupationLabelService.suggestOccupation.and.returnValue(Observable.of(suggestResponse));

            // when
            let suggestion;
            sut.fetchJobSearchOccupationSuggestions('java').subscribe((s) => suggestion = s);

            // then
            expect(suggestion).toEqual([
                new TypeaheadMultiselectModel(OccupationInputType.OCCUPATION, 'avam:10', 'Informatiker', 0),
                new TypeaheadMultiselectModel(OccupationInputType.OCCUPATION, 'x28:20', 'Bioinformatiker', 1),
                new TypeaheadMultiselectModel(OccupationInputType.OCCUPATION, 'x28:30,avam:111', 'Wirtschaftinformatiker', 2),
                new TypeaheadMultiselectModel(OccupationInputType.CLASSIFICATION, 'sbn3:300', 'Berufe der Informatik', 3)
            ]);
        });
    });

    describe('fetchCandidateSearchOccupationSuggestions', () => {
        it('should call suggestOccupation with the correct parameters', () => {
            // given
            mockOccupationLabelService.suggestOccupation.and.returnValue(Observable.of({
                occupations: [],
                classifications: []
            }));

            // when
            sut.fetchCandidateSearchOccupationSuggestions(Observable.of('java')).subscribe((c) => {
            });

            // then
            expect(mockOccupationLabelService.suggestOccupation).toHaveBeenCalledWith('java', ['avam']);
        });

        it('should map suggestion to OccupationOption[] using the avam code', () => {
            // given
            const suggestResponse: OccupationLabelAutocomplete = {
                occupations: [
                    {
                        id: '10',
                        code: 10,
                        label: 'Informatiker',
                        type: 'avam',
                        mappings: {
                            x28: 1,
                            bfs: 12
                        },
                        classifier: '',
                        language: 'de'
                    } as OccupationLabelSuggestion,
                ],
                classifications: []
            };
            mockOccupationLabelService.suggestOccupation.and.returnValue(Observable.of(suggestResponse));

            // when
            let suggestion;
            sut.fetchCandidateSearchOccupationSuggestions(Observable.of('java')).subscribe((s) => suggestion = s);

            // then
            expect(suggestion).toEqual([
                { key: 'avam:10', label: 'Informatiker' }
            ]);
        });
    });

    describe('fetchJobPublicationOccupationSuggestions', () => {
        it('should call suggestOccupation with the correct parameters', () => {
            // given
            mockOccupationLabelService.suggestOccupation.and.returnValue(Observable.of({
                occupations: [],
                classifications: []
            }));

            // when
            sut.fetchJobPublicationOccupationSuggestions(Observable.of('java')).subscribe((c) => {
            });

            // then
            expect(mockOccupationLabelService.suggestOccupation).toHaveBeenCalledWith('java', ['avam']);
        });

        it('should map suggestion to OccupationOption[] using the avam code', () => {
            // given
            const suggestResponse: OccupationLabelAutocomplete = {
                occupations: [
                    {
                        id: '10',
                        code: 10,
                        label: 'Informatiker',
                        type: 'avam',
                        mappings: {
                            x28: 1,
                            bfs: 12
                        },
                        classifier: '',
                        language: 'de'
                    } as OccupationLabelSuggestion,
                ],
                classifications: []
            };
            mockOccupationLabelService.suggestOccupation.and.returnValue(Observable.of(suggestResponse));

            // when
            let suggestion;
            sut.fetchJobPublicationOccupationSuggestions(Observable.of('java')).subscribe((s) => suggestion = s);

            // then
            expect(suggestion).toEqual([
                { key: 'avam:10', label: 'Informatiker' }
            ]);
        });
    });

});
