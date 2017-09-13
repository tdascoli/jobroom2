import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TypeaheadMultiselectModel } from '../typeahead-multiselect/typeahead-multiselect-model';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import {
    ClassificationSuggestion,
    OccupationAutocomplete,
    OccupationInputType,
    OccupationSuggestion
} from './occupation-autocomplete';

const DEFAULT_RESPONSE_SIZE = '10';
const SEARCH_URL = 'referenceservice/api/_search/occupations/synonym';

@Injectable()
export class OccupationService {

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

    getOccupations(query: string): Observable<TypeaheadMultiselectModel[]> {
        return this.fetchSuggestionsInternal(query)
            .map((occupationAutocomplete) => OccupationService.mapOccupationSuggestions(occupationAutocomplete.occupations))
            .catch(this.handleError);
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
