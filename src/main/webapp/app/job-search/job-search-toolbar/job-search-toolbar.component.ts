import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, ParamMap, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InputType, OccupationService, TypeaheadMultiselectModel } from '../../shared/job-search';

@Component({
    selector: 'jr2-job-search-toolbar',
    templateUrl: './job-search-toolbar.component.html',
    styleUrls: ['./job-search-toolbar.component.scss']
})
export class JobSearchToolbarComponent implements OnInit {
    @Input() total: number;
    queryModel: Array<TypeaheadMultiselectModel> = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private service: OccupationService) {
    }

    ngOnInit() {
        this.route.queryParams
            .map((params: Params) => convertToParamMap(params))
            .subscribe((paramMap: ParamMap) => {
                const classifications: Array<string> = paramMap.getAll('classification');
                const occupations: Array<string> = paramMap.getAll('occupation');
                const queries: Array<string> = paramMap.getAll('query');

                const classifications$ = this.service.getClassifications(classifications);
                const occupations$ = this.service.getOccupations(occupations);
                const queries$ = Observable.of(queries.map((q: string) => new TypeaheadMultiselectModel('free-text', q, q)));

                Observable.merge(classifications$, occupations$, queries$)
                    .reduce((array: any, value: any) => [...array, ...value], [])
                    .subscribe((result: any) => {
                        this.queryModel = result;
                    });
            });
    }

    search() {
        const query = this.queryModel
            .filter((value: TypeaheadMultiselectModel) => value.type === InputType.FREE_TEXT)
            .map((value: TypeaheadMultiselectModel) => value.label);
        const occupation = this.queryModel
            .filter((value: TypeaheadMultiselectModel) => value.type === InputType.OCCUPATION)
            .map((value: TypeaheadMultiselectModel) => value.label);
        const classification = this.queryModel
            .filter((value: TypeaheadMultiselectModel) => value.type === InputType.CLASSIFICATION)
            .map((value: TypeaheadMultiselectModel) => value.label);

        const params = Object.assign({}, { 'query': query }, { 'occupation': occupation }, { 'classification': classification });

        this.router.navigate(['job-search'], { queryParams: params });
    }

    fetchSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.service.fetchSuggestions(query);
}
