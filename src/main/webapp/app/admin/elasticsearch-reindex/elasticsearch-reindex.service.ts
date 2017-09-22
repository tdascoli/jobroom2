import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ElasticsearchReindexService {

    constructor(
      private http: Http
    ) { }

    reindex(): Observable<Response> {
        return this.http.post('api/elasticsearch/index', {});
    }
}
