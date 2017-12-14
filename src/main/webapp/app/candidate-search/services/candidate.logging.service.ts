import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CandidateSearchRequest } from './candidate-search-request';
import { CandidateSearchState } from '../state-management/state/candidate-search.state';
import { CandidateService } from './candidate.service';

@Injectable()
export class CandidateLoggingService {

    private loggingUrl = '/eventloggingservice/api/events';

    constructor(private http: Http, private candidateService: CandidateService) {
    }

    public logProfileEvent(event: Object): void {
        this.http.post(this.loggingUrl, event).subscribe();
    }

    public logSearchEvent(event: CandidateSearchRequest): void {
        const e = event as Object;
        e['event'] = 'search';
        this.http.post(this.loggingUrl, event).subscribe();
    }

    public logResultsList(state: CandidateSearchState): void {
        const occupationCode = state.searchFilter.occupation ? state.searchFilter.occupation.key : null;
        const itemsToLog = state.candidateProfileList.map((value, index, array) => {
            return {
                id: value.id,
                rank: index,
                hasSkills: this.candidateService.getRelevantJobExperience(occupationCode, value.jobExperiences).remark != null
            };
        });
        this.http.post(this.loggingUrl, { event: 'results', resultsList: itemsToLog }).subscribe();
    }
}
