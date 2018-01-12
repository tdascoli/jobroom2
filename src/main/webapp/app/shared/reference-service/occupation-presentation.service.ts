import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TYPEAHEAD_QUERY_MIN_LENGTH } from '../../app.constants';
import {
    OccupationLabel, OccupationLabelAutocomplete, OccupationLabelData,
    OccupationLabelService, OccupationLabelSuggestion
} from './occupation-label.service';
import { TypeaheadMultiselectModel } from '../input-components/typeahead/typeahead-multiselect-model';
import { TranslateService } from '@ngx-translate/core';
import { OccupationCode } from './occupation-code';

export class OccupationInputType {
    static OCCUPATION = 'occupation';
    static CLASSIFICATION = 'classification';
    static FREE_TEXT = 'free-text';
}

export interface SuggestionLoaderFn<T> {
    (term$: Observable<string>): Observable<T>;
}

export interface FormatterFn<T> {
    (obj: T): string;
}

// todo: Review if it is possible to use the same model interface for the TypeaheadMultiselect and a suggest input field.
export interface OccupationOption {
    key: string;
    label: string;
}

export interface GenderAwareOccupationLabel {
    default: string;
    male: string;
    female: string;
}

interface OccupationLabelDataCache {
    [key: string]: OccupationLabelData
}

@Injectable()
export class OccupationPresentationService {
    private occupationLabelDataCache: OccupationLabelDataCache = {};

    constructor(private occupationLabelService: OccupationLabelService,
                private translateService: TranslateService) {
    }

    findOccupationLabelsByAvamCode(avamCode: number): Observable<GenderAwareOccupationLabel> {
        return this.findOccupationLabelsByCode(new OccupationCode(avamCode, 'avam').toString());
    }

    findOccupationLabelsByBFSCode(bfsCode: number): Observable<GenderAwareOccupationLabel> {
        return this.findOccupationLabelsByCode(new OccupationCode(bfsCode, 'bfs').toString());
    }

    findOccupationLabelsByCode(occupationCodeString: string): Observable<GenderAwareOccupationLabel> {
        const labelDataMapper = (labelData: OccupationLabelData) => Object.assign({}, {
            default: labelData['default'],
            male: labelData['m'],
            female: labelData['f']
        });

        const currentLang = this.translateService.currentLang;
        const cacheKey = occupationCodeString + '_' + currentLang;
        const cachedOccupation = this.occupationLabelDataCache[cacheKey];
        if (cachedOccupation) {
            return Observable.of(this.occupationLabelDataCache[cacheKey])
                .map(labelDataMapper);
        }

        return this.occupationLabelService.getOccupationLabelsByKey(occupationCodeString)
            .do((labelData: OccupationLabelData) => this.occupationLabelDataCache[cacheKey] = labelData)
            .map(labelDataMapper)
    }

    fetchJobSearchOccupationSuggestions(query: string): Observable<Array<TypeaheadMultiselectModel>> {
        const occupationLabelMapper =
            (type: string) =>
                (startIdx: number) =>
                    (o: OccupationLabel | OccupationLabelSuggestion, idx: number) => {
                        const defaultCode = new OccupationCode(o.code, o.type).toString();
                        const avamCode = o['mappings'] && o['mappings'].avam && o.type === 'x28'
                            ? new OccupationCode(o['mappings'].avam, 'avam').toString()
                            : null;
                        const code = avamCode ? `${defaultCode},${avamCode}` : defaultCode;

                        return new TypeaheadMultiselectModel(type, code, o.label, idx + startIdx);
                    };

        const occupationMapper = occupationLabelMapper(OccupationInputType.OCCUPATION);
        const classificationMapper = occupationLabelMapper(OccupationInputType.CLASSIFICATION);

        return this.occupationLabelService.suggestOccupation(query, ['x28', 'sbn3', 'sbn5'])
            .map((occupationAutocomplete: OccupationLabelAutocomplete) => {
                const { occupations, classifications } = occupationAutocomplete;

                const mappedOccupations = occupations.map(occupationMapper(0));
                const mappedClassifications = classifications.map(classificationMapper(occupations.length));

                return [...mappedOccupations, ...mappedClassifications];
            })
    }

    fetchCandidateSearchOccupationSuggestions = (prefix$: Observable<string>): Observable<Array<OccupationOption>> =>
        prefix$
            .switchMap((prefix: string) => prefix.length < TYPEAHEAD_QUERY_MIN_LENGTH
                ? Observable.of([])
                : this.occupationLabelService.suggestOccupation(prefix, ['avam'])
                    .map((autoComplete: OccupationLabelAutocomplete) => autoComplete.occupations)
                    .map((occupations: OccupationLabelSuggestion[]) =>
                        occupations.map((o: OccupationLabelSuggestion) => Object.assign({}, {
                            key: new OccupationCode(o.code, 'avam').toString(),
                            label: o.label
                        })))
            );

    fetchJobPublicationOccupationSuggestions = (prefix$: Observable<string>): Observable<Array<OccupationOption>> =>
        prefix$
            .switchMap((prefix: string) => prefix.length < TYPEAHEAD_QUERY_MIN_LENGTH
                ? Observable.of([])
                : this.occupationLabelService.suggestOccupation(prefix, ['avam'])
                    .map((autoComplete: OccupationLabelAutocomplete) => autoComplete.occupations)
                    .map((occupations: OccupationLabelSuggestion[]) =>
                        occupations.map((o: OccupationLabelSuggestion) => Object.assign({}, {
                            key: new OccupationCode(o.code, 'avam').toString(),
                            label: o.label
                        })))
            );

    occupationFormatter = (occupationOption: OccupationOption) => occupationOption.label ? occupationOption.label : '';
}
