import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

const DEFAULT_RESPONSE_SIZE = '10';
const OCCUPATION_LABEL_RESOURCE_SEARCH_URL = 'referenceservice/api/_search/occupations/label';
const OCCUPATION_LABEL_RESOURCE_URL = 'referenceservice/api/occupations/label';

export interface OccupationLabelAutocomplete {
    occupations: OccupationLabelSuggestion[];
    classifications: OccupationLabel[];
}

export interface OccupationLabelSuggestion {
    id: string;
    code: number;
    type: string;
    language: string;
    classifier: string;
    label: string;
    mappings: Map<string, number>;
}

export interface OccupationLabel {
    id: string;
    code: number;
    type: string;
    language: string;
    classifier: string;
    label: string;
}

export interface OccupationLabelData {
    [key: string]: string
}

export interface OccupationLabelMapping {
    id: string;
    bfsCode: number;
    avamCode: number;
    sbn3Code: number;
    sbn5Code: number;
    description: string;
}

/**
 * This service is supposed to be a data service. The UI components should use the OccupationPresentationService
 * instead of this.
 */
@Injectable()
export class OccupationLabelService {
    constructor(private http: Http) {
    }

    suggestOccupation(prefix: string, types = ['avam', 'bfs', 'x28']): Observable<OccupationLabelAutocomplete> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('prefix', prefix);
        params.set('types', types.join(','));
        params.set('resultSize', DEFAULT_RESPONSE_SIZE);

        return this.http.get(OCCUPATION_LABEL_RESOURCE_SEARCH_URL, options)
            .map((res: Response) => <OccupationLabelAutocomplete>res.json())
    }

    getOccupationLabelsByCodeAndType(code: number, type: string): Observable<OccupationLabelData> {
        return this.getOccupationLabelsByCodeAndTypeAndClassifier(code, type, null);
    }

    getOccupationLabelsByCodeAndTypeAndClassifier(code: number, type: string, classifier: string): Observable<OccupationLabelData> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('code', String(code));
        params.set('type', type);
        if (classifier) {
            params.set('classifier', classifier);
        }

        return this.http.get(OCCUPATION_LABEL_RESOURCE_URL, options)
            .map((res: Response) => <OccupationLabelData>res.json())
    }

    getOccupationLabelsByKey(key: string): Observable<OccupationLabelData> {
        const options = new BaseRequestOptions();

        return this.http.get(`${OCCUPATION_LABEL_RESOURCE_URL}/${key}`, options)
            .map((res: Response) => <OccupationLabelData>res.json())
    }

    getOccupationMappingByAvamCode(code: number): Observable<OccupationLabelMapping> {
        return this.getOccupationMapping(code, 'avamCode');
    }

    getOccupationMappingByBFSCode(code: number): Observable<OccupationLabelMapping> {
        return this.getOccupationMapping(code, 'bfsCode');
    }

    getOccupationMappingByX28Code(code: number): Observable<OccupationLabelMapping> {
        return this.getOccupationMapping(code, 'x28Code');
    }

    private getOccupationMapping(code: number, type: string): Observable<OccupationLabelMapping> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;
        params.set('type', type);

        return this.http.get(`${OCCUPATION_LABEL_RESOURCE_URL}/mapping/${code}`, options)
            .map((res: Response) => <OccupationLabelMapping>res.json())
    }
}
