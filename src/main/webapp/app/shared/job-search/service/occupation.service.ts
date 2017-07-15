import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TypeaheadMultiselectModel } from '../typeahead-multiselect/typeahead-multiselect-model';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { InputType, OccupationAutocomplete, OccupationSuggestion } from './occupation-autocomplete';

const DEFAULT_RESPONSE_SIZE = '10';
const SEARCH_URL = 'referenceservice/api/_search/occupations';

@Injectable()
export class OccupationService {

    constructor(private http: Http, private translateService: TranslateService) {
    }

    fetchSuggestions(query: string): Observable<TypeaheadMultiselectModel[]> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('prefix', query);
        params.set('responseSize', DEFAULT_RESPONSE_SIZE);
        params.set('language', this.translateService.currentLang);

        return this.http.get(SEARCH_URL, options)
            .map((res: Response) => {
                const jsonResponse = <OccupationAutocomplete>res.json();

                const occupations = jsonResponse.occupations
                    .map((o: OccupationSuggestion) => new TypeaheadMultiselectModel(InputType.OCCUPATION, o.code, o.name, 0));
                // todo: ClassificationSuggestion has to be defined
                const classifications = (jsonResponse.classifications || [])
                    .map((c: any) => new TypeaheadMultiselectModel(InputType.CLASSIFICATION, c.code, c.name, 1));

                return [...occupations, ...classifications];
            })
            .catch(this.handleError);
    }

    getClassifications(labels: Array<string>): Observable<TypeaheadMultiselectModel[]> {
        // todo: REST endpoint is needed
        return Observable.of([]);
    }

    getOccupations(labels: Array<string>): Observable<TypeaheadMultiselectModel[]> {
        // todo: REST endpoint is needed
        return Observable.of([]);
    }

    private handleError(error: Response) {
        // todo: Error handling concept is not defined yet
        return Observable.of([]);
    }
}
