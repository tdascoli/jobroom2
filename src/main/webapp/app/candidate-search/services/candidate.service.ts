import { Injectable } from '@angular/core';
import { Candidate, CandidateProfile, JobExperience } from './candidate';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions, Http, Response } from '@angular/http';
import { CandidateSearchRequest } from './candidate-search-request';
import { ResponseWrapper } from '../../shared';
import { CandidateSearchFilter } from '../state-management/state/candidate-search.state';
import { createPageableURLSearchParams } from '../../shared/model/request-util';
import { Experience } from '../../shared/model/shared-types';
import { JhiBase64Service } from 'ng-jhipster';
import { Principal } from '../../shared/auth/principal.service';
import { OccupationCode } from '../../shared/reference-service/occupation-code';

@Injectable()
export class CandidateService {

    private resourceUrl = 'candidateservice/api/candidates';
    private searchUrl = 'candidateservice/api/_search/candidates';
    private countUrl = 'candidateservice/api/_count/candidates';

    private static convertResponse(res: Response): ResponseWrapper {
        return new ResponseWrapper(res.headers, res.json(), res.status);
    }

    static getBestMatchingJobExperience(occupationCodes: Array<string>, jobExperiences: JobExperience[]) {
        const hasOccupationCode =
            (occupationCode: OccupationCode) =>
                (jobExperience: JobExperience) => {
                    const { value, type } = occupationCode;
                    const { avamCode, bfsCode, sbn3Code, sbn5Code } = jobExperience.occupation;

                    return (avamCode === value && type === 'avam')
                        || (bfsCode === value && type === 'bfs')
                        || (sbn3Code === value && type === 'sbn3')
                        || (sbn5Code === value && type === 'sbn5')
                }
        ;

        const matchingExperiences = occupationCodes
            .map(OccupationCode.fromString)
            .map((occupationCode) => jobExperiences.find(hasOccupationCode(occupationCode)))
            .filter((jobExperience) => !!jobExperience)
            .reduce((acc, curr) => {
                const key = JSON.stringify(curr);
                if (!acc[key]) {
                    acc[key] = { count: 0, jobExperience: curr }
                }
                acc[key].count++;

                return acc;
            }, []);

        const matchingExperienceKeys = Object.keys(matchingExperiences);
        if (matchingExperienceKeys.length > 0) {
            const bestMatchingExperienceKey = matchingExperienceKeys
                .sort((k1, k2) => matchingExperiences[k1].count === matchingExperiences[k2].count
                    ? 0
                    : matchingExperiences[k1].count > matchingExperiences[k2].count ? -1 : 1
                )[0];

            return matchingExperiences[bestMatchingExperienceKey].jobExperience;
        } else {
            return null;
        }
    }

    constructor(private http: Http,
                private base64Service: JhiBase64Service,
                private principal: Principal) {
    }

    encodeURISearchFilter(filter: CandidateSearchFilter): string {
        return this.base64Service.encode(JSON.stringify(filter));
    }

    decodeURISearchFilter(URISearchFilter: string): CandidateSearchFilter {
        return JSON.parse(this.base64Service.decode(URISearchFilter));
    }

    findCandidate(candidateProfile: CandidateProfile): Observable<Candidate> {
        return this.canViewCandidateProtectedData(candidateProfile)
            .flatMap((canViewProtectedData) => {
                if (canViewProtectedData) {
                    return this.http.get(`${this.resourceUrl}/${candidateProfile.id}`)
                        .map((res: Response) => {
                            const jsonResponse = res.json();
                            return jsonResponse as Candidate;
                        });
                }
                return Observable.of(null as Candidate);
            });
    }

    private canViewCandidateProtectedData(candidateProfile: CandidateProfile): Observable<boolean> {
        return Observable.fromPromise(
            this.principal
                .hasAnyAuthority(['ROLE_PRIVATE_EMPLOYMENT_AGENT', 'ROLE_PUBLIC_EMPLOYMENT_SERVICE'])
        ).map((isEmploymentAgentOrService) => isEmploymentAgentOrService && candidateProfile.showProtectedData);
    }

    findCandidateProfile(id: string): Observable<CandidateProfile> {
        return this.http.get(`${this.resourceUrl}/profiles/${id}`)
            .map((res: Response) => {
                const jsonResponse = res.json();
                return jsonResponse as CandidateProfile;
            });
    }

    search(req: CandidateSearchRequest): Observable<ResponseWrapper> {
        const options = new BaseRequestOptions();
        options.params = createPageableURLSearchParams(req);

        return this.http.post(this.searchUrl, req, options)
            .map((res: Response) => CandidateService.convertResponse(res));
    }

    count(req: CandidateSearchRequest): Observable<number> {
        return this.http.post(this.countUrl, req)
            .map((res: Response) => CandidateService.convertResponse(res))
            .map((wrapper: ResponseWrapper) => {
                return Number.parseInt(wrapper.json.totalCount)
            });
    }

    getRelevantJobExperience(occupationCodes: Array<string>, jobExperiences: JobExperience[]): JobExperience {
        jobExperiences = jobExperiences
            .filter((jobExperience) => jobExperience.wanted);

        if (occupationCodes) {
            const bestMatchingJobExperience = CandidateService.getBestMatchingJobExperience(occupationCodes, jobExperiences);
            if (bestMatchingJobExperience) {
                return bestMatchingJobExperience;
            }
        }

        if (!jobExperiences.length) {
            return null;
        }

        const lastJobExperience = jobExperiences
            .find((jobExperience) => jobExperience.lastJob);

        if (lastJobExperience) {
            return lastJobExperience;
        }

        const mostExperienced = jobExperiences
            .sort((a, b) => +Experience[b.experience] - +Experience[a.experience])[0];

        if (mostExperienced) {
            return mostExperienced;
        }

        return jobExperiences[0];
    }
}
