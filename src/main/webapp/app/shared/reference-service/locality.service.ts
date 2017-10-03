import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
    CantonSuggestion,
    GeoPoint,
    LocalityAutocomplete,
    LocalityInputType,
    LocalitySuggestion
} from './locality-autocomplete';
import { Observer } from 'rxjs/Observer';
import { TypeaheadMultiselectModel } from '../input-components';

const LOCALITIES_URL = 'referenceservice/api/_search/localities';
const DEFAULT_RESPONSE_SIZE = '10';

export const NAVIGATOR_TOKEN = new InjectionToken<NavigatorGeolocation>('NavigatorGeolocation');

@Injectable()
export class LocalityService {

    constructor(private http: Http,
                @Inject(NAVIGATOR_TOKEN) private navigator: NavigatorGeolocation) {
    }

    fetchSuggestions(prefix: string): Observable<TypeaheadMultiselectModel[]> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('prefix', prefix);
        params.set('resultSize', DEFAULT_RESPONSE_SIZE);

        return this.http.get(LOCALITIES_URL, options)
            .map((res: Response) => {
                const jsonResponse = <LocalityAutocomplete>res.json();

                const localities = jsonResponse.localities
                    .map((o: LocalitySuggestion) =>
                        new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, String(o.communalCode), o.city, 0));

                const cantons = jsonResponse.cantons
                    .map((o: CantonSuggestion) =>
                        new TypeaheadMultiselectModel(LocalityInputType.CANTON, String(o.code), o.name + ' (' + o.code + ')', 0));

                return [...localities, ...cantons];
            })
            .catch(this.handleError);
    }

    getNearestLocality(geoPoint: GeoPoint): Observable<LocalitySuggestion> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('latitude', geoPoint.latitude.toString());
        params.set('longitude', geoPoint.longitude.toString());

        return this.http.get(`${LOCALITIES_URL}/nearest`, options)
            .map((res: Response) => <LocalitySuggestion>res.json());
    }

    getCurrentPosition(): Observable<GeoPoint> {
        return new Observable((observer: Observer<GeoPoint>) => {
            // Invokes getCurrentPosition method of Geolocation API.
            if ('geolocation' in this.navigator) {
                this.navigator.geolocation.getCurrentPosition(
                    (position: Position) => {
                        observer.next(position.coords);
                        observer.complete();
                    },
                    (error: PositionError) => {
                        observer.error(error);
                    }
                );
            } else {
                observer.error('Geolocation is not available!');
            }
        });
    }

    private handleError(error: Response) {
        // todo: Error handling concept is not defined yet
        return Observable.of([]);
    }
}