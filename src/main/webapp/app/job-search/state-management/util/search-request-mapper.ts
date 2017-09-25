import {
    ContractType,
    JobSearchFilter,
    JobSearchQuery,
    Sort
} from '../state/job-search.state';
import { JobSearchRequest } from '../../services/job-search-request';
import { TypeaheadMultiselectModel } from '../../../shared/input-components';
import { OccupationInputType } from '../../../shared/job-search/service/occupation-autocomplete';
import { LocalityInputType } from '../../../shared/job-search/service/locality-autocomplete';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';

const toCode = (value: TypeaheadMultiselectModel) => value.code;
const toLabel = (value: TypeaheadMultiselectModel) => value.label;
const byValue = (type: string) => (value: TypeaheadMultiselectModel) => value.type === type;

export function createJobSearchRequest(searchQuery: JobSearchQuery, searchFilter: JobSearchFilter, page = 0): JobSearchRequest {
    const { baseQuery, localityQuery } = searchQuery;
    const { companyName } = searchFilter;

    const keywords = baseQuery.filter(byValue(OccupationInputType.FREE_TEXT)).map(toLabel);
    const occupations = baseQuery.filter(byValue(OccupationInputType.OCCUPATION)).map(toCode);
    const classifications = baseQuery.filter(byValue(OccupationInputType.CLASSIFICATION)).map(toCode);

    const localities = localityQuery.filter(byValue(LocalityInputType.LOCALITY)).map(toCode);
    const cantons = localityQuery.filter(byValue(LocalityInputType.CANTON)).map(toCode);

    const permanent = mapContractType(searchFilter.contractType);
    const sort = mapSort(searchFilter.sort);
    const regions = [];

    return {
        keywords,
        occupations,
        classifications,
        localities,
        regions,
        cantons,
        permanent,
        workingTimeMin: searchFilter.workingTime[0],
        workingTimeMax: searchFilter.workingTime[1],
        sort,
        companyName,
        page,
        size: ITEMS_PER_PAGE
    };
}

function mapContractType(contractType: ContractType): boolean {
    let contractTypeFlag;
    if (contractType === ContractType.PERMANENT) {
        contractTypeFlag = true;
    } else if (contractType === ContractType.TEMPORARY) {
        contractTypeFlag = false;
    } else {
        contractTypeFlag = null;
    }

    return contractTypeFlag;
}

function mapSort(sort: Sort): string {
    let sortString;
    if (sort === Sort.DATE_ASC) {
        sortString = 'registrationDate,asc';
    } else if (sort === Sort.DATE_DESC) {
        sortString = 'registrationDate,desc';
    } else {
        sortString = null;
    }

    return sortString;
}
