import { ContractType, JobSearchFilter, JobSearchQuery } from '../state/job-search.state';
import { JobSearchRequest } from '../../services/job-search-request';
import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { OccupationInputType } from '../../../shared/job-search/service/occupation-autocomplete';
import { LocalityInputType } from '../../../shared/job-search/service/locality-autocomplete';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';

export function createJobSearchRequest(searchQuery: JobSearchQuery, searchFilter: JobSearchFilter, page = 0): JobSearchRequest {
    const keywords = searchQuery.baseQuery
        .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.FREE_TEXT)
        .map((value: TypeaheadMultiselectModel) => value.label);
    const occupations = searchQuery.baseQuery
        .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.OCCUPATION)
        .map((value: TypeaheadMultiselectModel) => value.code);
    const classifications = searchQuery.baseQuery
        .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.CLASSIFICATION)
        .map((value: TypeaheadMultiselectModel) => value.code);

    const localities = searchQuery.localityQuery
        .filter((value: TypeaheadMultiselectModel) => value.type === LocalityInputType.LOCALITY)
        .map((value: TypeaheadMultiselectModel) => value.code);
    const cantons = searchQuery.localityQuery
        .filter((value: TypeaheadMultiselectModel) => value.type === LocalityInputType.CANTON)
        .map((value: TypeaheadMultiselectModel) => value.code);

    const regions = [];

    let contractTypeFlag;
    if (searchFilter.contractType === ContractType.Permanent) {
        contractTypeFlag = true;
    } else if (searchFilter.contractType === ContractType.Temporary) {
        contractTypeFlag = false;
    } else {
        contractTypeFlag = null;
    }

    return {
        keywords,
        occupations,
        classifications,
        localities,
        regions,
        cantons,
        permanent: contractTypeFlag,
        workingTimeMin: searchFilter.workingTime[0],
        workingTimeMax: searchFilter.workingTime[1],
        sort: searchFilter.sort,
        companyName: searchFilter.companyName,
        page,
        size: ITEMS_PER_PAGE
    };
}
