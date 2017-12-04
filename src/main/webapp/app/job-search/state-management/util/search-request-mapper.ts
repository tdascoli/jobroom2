import {
    ContractType,
    JobSearchFilter,
    JobSearchQuery,
    Sort
} from '../state/job-search.state';
import { JobSearchRequest } from '../../services/job-search-request';
import { TypeaheadMultiselectModel } from '../../../shared/input-components';
import {
    LocalityInputType,
    OccupationInputType
} from '../../../shared/reference-service';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { JobSearchToolState } from '../../../home/state-management/state/job-search-tool.state';
import { OccupationCode } from '../../../shared/reference-service/occupation-code';

const toCode = (value: TypeaheadMultiselectModel) => value.code;
const toLabel = (value: TypeaheadMultiselectModel) => value.label;
const byValue = (type: string) => (value: TypeaheadMultiselectModel) => value.type === type;

export function createJobSearchRequest(searchQuery: JobSearchQuery, searchFilter: JobSearchFilter, page = 0): JobSearchRequest {
    const { baseQuery, localityQuery } = searchQuery;
    const { companyName, onlineSince } = searchFilter;

    let request = populateBaseQuery({}, baseQuery);
    request = populateLocalityQuery(request, localityQuery);

    const permanent = mapContractType(searchFilter.contractType);
    const sort = mapSort(searchFilter.sort);
    const regions = [];

    return Object.assign({
        regions,
        permanent,
        workingTimeMin: searchFilter.workingTime[0],
        workingTimeMax: searchFilter.workingTime[1],
        sort,
        companyName,
        onlineSince,
        page,
        size: ITEMS_PER_PAGE
    }, request);
}

function populateBaseQuery(request, baseQuery: Array<TypeaheadMultiselectModel>) {
    const keywords = baseQuery.filter(byValue(OccupationInputType.FREE_TEXT)).map(toLabel);
    const occupations = baseQuery.filter(byValue(OccupationInputType.OCCUPATION))
        .map(toCode)
        .map(OccupationCode.fromString);
    const classifications = baseQuery.filter(byValue(OccupationInputType.CLASSIFICATION))
        .map(toCode)
        .map(OccupationCode.fromString);
    const occupationCodes = [...occupations, ...classifications];

    return Object.assign({}, request, { keywords, occupationCodes });
}

function populateLocalityQuery(request, localityQuery: Array<TypeaheadMultiselectModel>) {
    const localities = localityQuery.filter(byValue(LocalityInputType.LOCALITY)).map(toCode);
    const cantons = localityQuery.filter(byValue(LocalityInputType.CANTON)).map(toCode);
    return Object.assign({}, request, { localities, cantons });
}

export function createJobSearchRequestFromToolState(toolState: JobSearchToolState): JobSearchRequest {
    const { baseQuery, localityQuery } = toolState;
    const request = populateBaseQuery({}, baseQuery);
    return populateLocalityQuery(request, localityQuery);
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
