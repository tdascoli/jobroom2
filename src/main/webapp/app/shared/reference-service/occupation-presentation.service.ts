import { Injectable } from '@angular/core';
import { OccupationService } from './occupation.service';
import { Observable } from 'rxjs/Observable';
import { TYPEAHEAD_QUERY_MIN_LENGTH } from '../../app.constants';
import { OccupationSuggestion } from './occupation-autocomplete';

export interface SuggestionLoaderFn<T> {
    (term$: Observable<string>): Observable<T>;
}

export interface FormatterFn<T> {
    (obj: T): string;
}

@Injectable()
export class OccupationPresentationService {

    constructor(private occupationService: OccupationService) {
    }

    fetchOccupationSuggestions = (prefix$: Observable<string>) => prefix$
        .filter((prefix: string) => prefix.length >= TYPEAHEAD_QUERY_MIN_LENGTH)
        .switchMap((prefix: string) => this.occupationService.getOccupations(prefix));

    occupationFormatter = (occupation: OccupationSuggestion) => occupation.name;
}
