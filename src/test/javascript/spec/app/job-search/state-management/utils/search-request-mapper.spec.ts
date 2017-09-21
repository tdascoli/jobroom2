import { createJobSearchRequest } from '../../../../../../../main/webapp/app/job-search/state-management/util/search-request-mapper';
import {
    ContractType,
    JobSearchFilter,
    JobSearchQuery,
    Sort
} from '../../../../../../../main/webapp/app/job-search/state-management/state/job-search.state';
import { JobSearchRequest } from '../../../../../../../main/webapp/app/job-search/services/job-search-request';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { OccupationInputType } from '../../../../../../../main/webapp/app/shared/job-search/service/occupation-autocomplete';
import { LocalityInputType } from '../../../../../../../main/webapp/app/shared/job-search/service/locality-autocomplete';

describe('createJobSearchRequest', () => {
    const defaultQuery: JobSearchQuery = {
        baseQuery: [],
        localityQuery: []
    };

    const defaultFilter: JobSearchFilter = {
        contractType: ContractType.ALL,
        workingTime: [0, 100],
        sort: Sort.RELEVANCE_DESC
    };

    it('should map JobSearchFilter with default sort', () => {
        // WHEN
        const jobSearchRequest: JobSearchRequest = createJobSearchRequest(defaultQuery, defaultFilter);

        // THEN
        expect(jobSearchRequest.sort).toEqual(null);
    });

    it('should map JobSearchFilter with sort by date asc', () => {
        // GIVEN
        const filter: JobSearchFilter = Object.assign({}, defaultFilter, { sort: Sort.DATE_ASC });

        // WHEN
        const jobSearchRequest: JobSearchRequest = createJobSearchRequest(defaultQuery, filter);

        // THEN
        expect(jobSearchRequest.sort).toEqual('registrationDate,asc');
    });

    it('should map JobSearchFilter with sort by date desc', () => {
        // GIVEN
        const filter: JobSearchFilter = Object.assign({}, defaultFilter, { sort: Sort.DATE_DESC });

        // WHEN
        const jobSearchRequest: JobSearchRequest = createJobSearchRequest(defaultQuery, filter);

        // THEN
        expect(jobSearchRequest.sort).toEqual('registrationDate,desc');
    });

    it('should map JobSearchFilter with default contract type', () => {
        // WHEN
        const jobSearchRequest: JobSearchRequest = createJobSearchRequest(defaultQuery, defaultFilter);

        // THEN
        expect(jobSearchRequest.permanent).toEqual(null);
    });

    it('should map JobSearchFilter with permanent contract type', () => {
        // GIVEN
        const filter: JobSearchFilter = Object.assign({}, defaultFilter, { contractType: ContractType.PERMANENT, });

        // WHEN
        const jobSearchRequest: JobSearchRequest = createJobSearchRequest(defaultQuery, filter);

        // THEN
        expect(jobSearchRequest.permanent).toBeTruthy();
    });

    it('should map JobSearchFilter with temporary contract type', () => {
        // GIVEN
        const filter: JobSearchFilter = Object.assign({}, defaultFilter, { contractType: ContractType.TEMPORARY, });

        // WHEN
        const jobSearchRequest: JobSearchRequest = createJobSearchRequest(defaultQuery, filter);

        // THEN
        expect(jobSearchRequest.permanent).toBeFalsy();
    });

    it('should map JobSearchQuery', () => {
        // GIVEN
        const query: JobSearchQuery = {
            baseQuery: [
                new TypeaheadMultiselectModel(OccupationInputType.FREE_TEXT, 'c1', 'l1'),
                new TypeaheadMultiselectModel(OccupationInputType.OCCUPATION, 'c2', 'l2'),
                new TypeaheadMultiselectModel(OccupationInputType.CLASSIFICATION, 'c3', 'l3')
            ],
            localityQuery: [
                new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, 'c4', 'l4'),
                new TypeaheadMultiselectModel(LocalityInputType.CANTON, 'c5', 'l5')
            ]
        };

        // WHEN
        const jobSearchRequest: JobSearchRequest = createJobSearchRequest(query, defaultFilter);

        // THEN
        expect(jobSearchRequest.keywords).toEqual(['l1']);
        expect(jobSearchRequest.occupations).toEqual(['c2']);
        expect(jobSearchRequest.classifications).toEqual(['c3']);
        expect(jobSearchRequest.localities).toEqual(['c4']);
        expect(jobSearchRequest.cantons).toEqual(['c5']);
    });
});
