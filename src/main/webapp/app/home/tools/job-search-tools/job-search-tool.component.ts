import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { OccupationService } from '../../../shared/job-search/service/occupation.service';

@Component({
    selector: 'jr2-job-search-tool',
    templateUrl: './job-search-tool.component.html',
    styleUrls: ['./job-search-tool.component.scss']
})
export class JobSearchToolComponent {
    queryModel: Array<TypeaheadMultiselectModel> = [];

    constructor(private router: Router, private service: OccupationService) {
    }

    search() {
        this.router.navigate(['/job-search']);
    }

    fetchSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.service.fetchSuggestions(query);
}
