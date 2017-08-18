import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../typeahead-multiselect/typeahead-multiselect-model';
import { Locality } from '../index';
import { GeoPoint, LocalityInputType } from './locality';
import { Observer } from 'rxjs/Observer';

const LOCALITIES_URL = 'referenceservice/api/_search/localities';

@Injectable()
export class LocalityService {

    constructor(private http: Http) {
    }

    fetchSuggestions(query: string): Observable<TypeaheadMultiselectModel[]> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('query', `${query}*`);

        return this.http.get(LOCALITIES_URL, options)
            .map((res: Response) => {
                const jsonResponse = <Locality[]>res.json();

                const localities = jsonResponse
                    .map((o: Locality) => o.city)
                    .reduce((result: Array<string>, current: string) =>
                        result.indexOf(current) > -1 ? result : [...result, current], [])
                    .map((city: string) => new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, city, city, 1));

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
            navigator.geolocation.getCurrentPosition(
                (position: Position) => {
                    observer.next(position.coords);
                    observer.complete();
                },
                (error: PositionError) => {
                    observer.error(error);
                }
            );
        });
    }

    private handleError(error: Response) {
        // todo: Error handling concept is not defined yet
        return Observable.of([]);
    }
}
