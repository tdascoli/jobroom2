import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import {
    ClassificationSuggestion,
    OccupationAutocomplete,
    OccupationInputType,
    OccupationSuggestion
} from './occupation-autocomplete';
import { TypeaheadMultiselectModel } from '../input-components';

const DEFAULT_RESPONSE_SIZE = '10';
const SEARCH_URL = 'referenceservice/api/_search/occupations/synonym';
const OCCUPATIONS_URL = 'referenceservice/api/occupations';

export interface Occupation {
    code: number;
    id: string;
    labels: any[];
}

interface OccupationCache {
    [key: string]: Occupation
}

@Injectable()
export class OccupationService {
    private occupationCache: OccupationCache = {};

    private static mapOccupationSuggestions(occupationSuggestions: OccupationSuggestion[]): TypeaheadMultiselectModel[] {
        return occupationSuggestions
            .map((o: OccupationSuggestion) => new TypeaheadMultiselectModel(OccupationInputType.OCCUPATION, o.code, o.name, 0));
    }

    private static mapClassificationSuggestions(classificationSuggestions: ClassificationSuggestion[]): TypeaheadMultiselectModel[] {
        return classificationSuggestions
            .map((c: ClassificationSuggestion) => new TypeaheadMultiselectModel(OccupationInputType.CLASSIFICATION, c.code, c.name, 1));
    }

    constructor(private http: Http, private translateService: TranslateService) {
    }

    fetchSuggestions(query: string): Observable<TypeaheadMultiselectModel[]> {
        return this.fetchSuggestionsInternal(query)
            .map((occupationAutocomplete) => {
                const occupations = OccupationService.mapOccupationSuggestions(occupationAutocomplete.occupations);
                const classifications = OccupationService.mapClassificationSuggestions(occupationAutocomplete.classifications);

                return [...occupations, ...classifications];
            })
            .catch(this.handleError);
    }

    getOccupations(query: string): Observable<OccupationSuggestion[]> {
        return this.fetchSuggestionsInternal(query)
            .map((occupationAutocomplete) => occupationAutocomplete.occupations)
            .catch(this.handleError);
    }

    findOccupationByCode(code: number): Observable<Occupation> {
        const cachedOccupation = this.occupationCache[code];
        if (cachedOccupation) {
            return Observable.of(this.occupationCache[code]);
        }

        const params: URLSearchParams = new URLSearchParams();
        params.set('code', code.toString());
        const options = new BaseRequestOptions();
        options.params = params;

        return this.http.get(OCCUPATIONS_URL, options)
            .map((res: Response) => res.json() as Occupation)
            .do((occupation: Occupation) => this.occupationCache[occupation.code] = occupation)
            .map((occupation: Occupation) => occupation)
    }

    private fetchSuggestionsInternal(query: string): Observable<OccupationAutocomplete> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('prefix', query);
        params.set('resultSize', DEFAULT_RESPONSE_SIZE);
        params.set('language', this.translateService.currentLang);

        return this.http.get(SEARCH_URL, options)
            .map((res: Response) => <OccupationAutocomplete>res.json());
    }

    private handleError(error: Response) {
        // todo: Error handling concept is not defined yet
        return Observable.of([]);
    }
}
