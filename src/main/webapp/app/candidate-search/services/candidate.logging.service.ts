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

    /**
     * Logs an arbitrary Object as a candidate event
     * @param {Object} event Data to be logged
     */
    public logCandidateEvent(event: Object): void {
        this.http.post(this.loggingUrl, event).subscribe();
    }

    /**
     * Logs a search request
     * @param {CandidateSearchRequest} event Search request to be logged
     */
    public logSearchEvent(event: CandidateSearchRequest): void {
        const e = event as Object;
        e['event'] = 'search';
        this.http.post(this.loggingUrl, event).subscribe();
    }

    /**
     * Logs the IDs and positions of candidates in the results list
     * @param {CandidateSearchState} state State of the search for which to log results
     */
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
