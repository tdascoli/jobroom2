import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ElasticsearchReindexService {

    private readonly documentUrls = {
        'users': '',
        'jobs': 'jobservice/',
        'candidates': 'candidateservice/',
        'reference-data': 'referenceservice/',
    };

    constructor(
      private http: Http
    ) { }

    reindex(document: string): Observable<void> {
        let urls = [this.documentUrls[document]];
        if (document === 'all') {
            urls = Object.keys(this.documentUrls)
                .map((key) => this.documentUrls[key]);
        }

        return Observable.from(urls)
            .map((url) => this.http.post(`${url}api/elasticsearch/index`, {}))
            .zipAll();
    }
}
