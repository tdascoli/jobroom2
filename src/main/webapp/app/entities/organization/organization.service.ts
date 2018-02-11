import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Organization } from './organization.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Organization>;

@Injectable()
export class OrganizationService {

    private resourceUrl =  SERVER_API_URL + 'api/organizations';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/organizations';

    constructor(private http: HttpClient) { }

    create(organization: Organization): Observable<EntityResponseType> {
        const copy = this.convert(organization);
        return this.http.post<Organization>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(organization: Organization): Observable<EntityResponseType> {
        const copy = this.convert(organization);
        return this.http.put<Organization>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Organization>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Organization[]>> {
        const options = createRequestOption(req);
        return this.http.get<Organization[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Organization[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Organization[]>> {
        const options = createRequestOption(req);
        return this.http.get<Organization[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Organization[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Organization = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Organization[]>): HttpResponse<Organization[]> {
        const jsonResponse: Organization[] = res.body;
        const body: Organization[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Organization.
     */
    private convertItemFromServer(organization: Organization): Organization {
        const copy: Organization = Object.assign({}, organization);
        return copy;
    }

    /**
     * Convert a Organization to a JSON which can be sent to the server.
     */
    private convert(organization: Organization): Organization {
        const copy: Organization = Object.assign({}, organization);
        return copy;
    }
}
