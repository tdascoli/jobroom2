import { URLSearchParams } from '@angular/http';
import { TypeaheadMultiselectModel } from '../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { OccupationInputType } from '../../shared/job-search/service/occupation-autocomplete';
import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { JobSearchFilter, JobSearchQuery } from '../../job-search/state-management/index';
import { LocalityInputType } from '../../shared/job-search/service/locality-autocomplete';
import { ContractType } from '../../job-search/state-management/state/job-search.state';

export class JobSearchRequest {

    constructor(private searchQuery: JobSearchQuery,
                private searchFilter: JobSearchFilter,
                private page = 0) {
    }

    toMap(): any {
        const keywords = this.searchQuery.baseQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.FREE_TEXT)
            .map((value: TypeaheadMultiselectModel) => value.label);
        const occupations = this.searchQuery.baseQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.OCCUPATION)
            .map((value: TypeaheadMultiselectModel) => value.code);
        const classifications = this.searchQuery.baseQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.CLASSIFICATION)
            .map((value: TypeaheadMultiselectModel) => value.code);

        const localities = this.searchQuery.localityQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === LocalityInputType.LOCALITY)
            .map((value: TypeaheadMultiselectModel) => value.code);
        const cantons = this.searchQuery.localityQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === LocalityInputType.CANTON)
            .map((value: TypeaheadMultiselectModel) => value.code);

        const regions = [];

        let contractTypeFlag;
        if (this.searchFilter.contractType === ContractType.Permanent) {
            contractTypeFlag = true;
        } else if (this.searchFilter.contractType === ContractType.Temporary) {
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
            workingTimeMin: this.searchFilter.workingTime[0],
            workingTimeMax: this.searchFilter.workingTime[1],
            sort: this.searchFilter.sort,
            page: this.page,
            size: ITEMS_PER_PAGE
        };
    }

    toURLSearchParams(): URLSearchParams {
        const params: URLSearchParams = new URLSearchParams();
        const paramMap = this.toMap();

        Object.keys(paramMap).forEach((key: string) => {
            const value = paramMap[key];
            if (Array.isArray(value)) {
                value.forEach((v: any) => {
                    params.append(key, v);
                });
            } else {
                params.set(key, value);
            }
        });

        return params;
    }
}
