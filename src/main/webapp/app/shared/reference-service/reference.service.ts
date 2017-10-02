import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

const REFERENCESERVICE_URL = 'referenceservice/api/';
const JOB_CENTER_URL = REFERENCESERVICE_URL + 'job-centers';

export class Address {
    constructor(public name: string,
                public street: string,
                public houseNumber: string,
                public zipCode: string,
                public city: string) {
    }
}

export class JobCenter {
    constructor(public id: string,
                public code: string,
                public email: string,
                public phone: string,
                public fax: string,
                public address: Address) {
    }
}

@Injectable()
export class ReferenceService {

    constructor(private http: Http, private translateService: TranslateService) {
    }

    resolveJobCenter(code: string): Observable<JobCenter> {
        const options = new BaseRequestOptions();
        const params: URLSearchParams = new URLSearchParams();
        options.params = params;

        params.set('code', code);
        params.set('language', this.translateService.currentLang);

        return this.http.get(JOB_CENTER_URL, options)
            .map((res: Response) => {
                return <JobCenter>res.json();
            });
    }
}
