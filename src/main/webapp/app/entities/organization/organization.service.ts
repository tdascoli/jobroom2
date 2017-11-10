import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Organization } from './organization.model';
import { createRequestOption, ResponseWrapper } from '../../shared';

@Injectable()
export class OrganizationService {

    private resourceUrl = SERVER_API_URL + 'api/organizations';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/organizations';

    constructor(private http: Http) {
    }

    create(organization: Organization): Observable<Organization> {
        const copy = this.convert(organization);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(organization: Organization): Observable<Organization> {
        const copy = this.convert(organization);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Organization> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Organization.
     */
    private convertItemFromServer(json: any): Organization {
        const entity: Organization = Object.assign(new Organization(), json);
        return entity;
    }

    /**
     * Convert a Organization to a JSON which can be sent to the server.
     */
    private convert(organization: Organization): Organization {
        const copy: Organization = Object.assign({}, organization);
        return copy;
    }
}
