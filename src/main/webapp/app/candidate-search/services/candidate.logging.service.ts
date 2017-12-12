import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class CandidateLoggingService {

    private loggingUrl = '/eventloggingservice/api/events';

    constructor(private http: Http) {
    }

    public logProfileEvent(event: Object): void {
        this.http.post(this.loggingUrl, event).subscribe();
    }

    public logSearchEvent(event: Object): void {
        this.http.post(this.loggingUrl, event).subscribe();
    }
}
