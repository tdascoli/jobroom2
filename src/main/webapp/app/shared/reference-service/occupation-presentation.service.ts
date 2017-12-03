import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TYPEAHEAD_QUERY_MIN_LENGTH } from '../../app.constants';
import {
    OccupationLabel,
    OccupationLabelAutocomplete,
    OccupationLabelData,
    OccupationLabelService,
    OccupationLabelSuggestion
} from './occupation-label.service';
import { TypeaheadMultiselectModel } from '../input-components/typeahead/typeahead-multiselect-model';
import { TranslateService } from '@ngx-translate/core';

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

export interface OccupationOption {
    key: string;
    label: string;
}

export class OccupationCode {
    static toString(occupationCode: OccupationCode) {
        if (occupationCode.classifier) {
            return `${occupationCode.type}:${occupationCode.code}:${occupationCode.classifier }`;
        } else {
            return `${occupationCode.type}:${occupationCode.code}`;
        }
    }

    static fromString(codeAsString: string): OccupationCode {
        const codeArray = codeAsString.split(':');
        const type = codeArray[0];
        const code = +codeArray[1];
        const classifier = codeArray[2];

        return new OccupationCode(code, type, classifier);
    }

    constructor(public code: number,
                public type: string,
                public classifier = null) {
    }

    toString(): string {
        return OccupationCode.toString(this);
    }
}

export interface GenderAwareOccupationLabel {
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

    findOccupationLabelsByBSFCode(bfsCode: number): Observable<GenderAwareOccupationLabel> {
        return this.findOccupationLabelsByCode(new OccupationCode(bfsCode, 'bfs').toString());
    }

    findOccupationLabelsByCode(occupationCodeString: string): Observable<GenderAwareOccupationLabel> {
        const labelDataMapper = (labelData: OccupationLabelData) => Object.assign({}, {
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

    fetchSuggestions(query: string): Observable<TypeaheadMultiselectModel[]> {
        const occupationLabelMapper =
            (type: string) =>
                (startIdx: number) =>
                    (o: OccupationLabel, idx: number) =>
                        new TypeaheadMultiselectModel(type,
                            OccupationCode.toString(o as OccupationCode),
                            o.label,
                            idx + startIdx
                        );

        const occupationMapper = occupationLabelMapper(OccupationInputType.OCCUPATION);
        const classificationMapper = occupationLabelMapper(OccupationInputType.CLASSIFICATION);

        return this.occupationLabelService.suggestOccupation(query)
            .map((occupationAutocomplete: OccupationLabelAutocomplete) => {
                const { occupations, classifications } = occupationAutocomplete;

                const mappedOccupations = occupations.map(occupationMapper(0));
                const mappedClassifications = classifications.map(classificationMapper(occupations.length));

                return [...mappedOccupations, ...mappedClassifications];
            })
    }

    fetchOccupationSuggestions = (prefix$: Observable<string>): Observable<Array<OccupationOption>> =>
        prefix$
            .filter((prefix: string) => prefix.length >= TYPEAHEAD_QUERY_MIN_LENGTH)
            .switchMap((prefix: string) =>
                // todo: Review the candidate indexing.
                this.occupationLabelService.suggestOccupation(prefix, ['avam'])
                    .map((autoComplete: OccupationLabelAutocomplete) => autoComplete.occupations)
                    .map((occupations: OccupationLabelSuggestion[]) =>
                        occupations.map((o: OccupationLabelSuggestion) => Object.assign({}, {
                            key: OccupationCode.toString(new OccupationCode(o.mappings['bfs'], 'bfs')),
                            label: o.label
                        })))
            );

    occupationFormatter = (occupationOption: OccupationOption) => occupationOption.label ? occupationOption.label : '';
}
