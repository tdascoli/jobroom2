import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../typeahead-multiselect/typeahead-multiselect-model';
import { Locality } from '../index';
import { GeoPoint, LocalityInputType } from './locality';
import { Observer } from 'rxjs/Observer';

const LOCALITIES_URL = 'referenceservice/api/_search/localities';
const DEFAULT_RESPONSE_SIZE = '10';

export const NAVIGATOR_TOKEN = new InjectionToken<NavigatorGeolocation>('NavigatorGeolocation');

@Injectable()
export class LocalityService {

    constructor(private http: Http,
                @Inject(NAVIGATOR_TOKEN) private navigator: NavigatorGeolocation) {
    }

    fetchSuggestions(query: string): Observable<TypeaheadMultiselectModel[]> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('prefix', `${query}`);
        params.set('resultSize', DEFAULT_RESPONSE_SIZE);

        return this.http.get(LOCALITIES_URL, options)
            .map((res: Response) => {
                const jsonResponse = <Locality[]>res.json();

                const localities = jsonResponse
                    .map((o: Locality) => o.city)
                    .reduce((result: Array<string>, current: string) =>
                        result.indexOf(current) > -1 ? result : [...result, current], [])
                    .map((city: string) => new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, city, city, 0));

                // Todo: We should add cantons and regions

                return [...localities];
            })
            .catch(this.handleError);
    }

    getNearestLocality(geoPoint: GeoPoint): Observable<Locality> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('latitude', geoPoint.latitude.toString());
        params.set('longitude', geoPoint.longitude.toString());

        return this.http.get(`${LOCALITIES_URL}/nearest`, options)
            .map((res: Response) => <Locality>res.json());
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
