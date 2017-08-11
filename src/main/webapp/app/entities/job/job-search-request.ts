import { URLSearchParams } from '@angular/http';
import { TypeaheadMultiselectModel } from '../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { InputType } from '../../shared/job-search/service/occupation-autocomplete';
import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';

export class JobSearchRequest {

    constructor(private baseQuery: Array<TypeaheadMultiselectModel>,
                private locationQuery: Array<TypeaheadMultiselectModel>,
                private page = 0) {
    }

    toMap(): any {
        const keywords = this.baseQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === InputType.FREE_TEXT)
            .map((value: TypeaheadMultiselectModel) => value.label);
        const occupations = this.baseQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === InputType.OCCUPATION)
            .map((value: TypeaheadMultiselectModel) => value.code);
        const classifications = this.baseQuery
            .filter((value: TypeaheadMultiselectModel) => value.type === InputType.CLASSIFICATION)
            .map((value: TypeaheadMultiselectModel) => value.code);

        // todo: Implement this with JR2-34
        const localities = [];
        const regions = [];
        const cantons = [];

        return {
            keywords,
            occupations,
            classifications,
            localities,
            regions,
            cantons,
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
