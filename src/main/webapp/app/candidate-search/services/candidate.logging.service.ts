import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class CandidateLoggingService {

    private profileEventUrl = '/candidateservice/api/_profilemetrics/candidates';

    constructor(private http: Http) {
    }

    public logProfileEvent(event: Object): void {
        console.log(event);
        this.http.post(this.profileEventUrl, event).subscribe();
    }
}
