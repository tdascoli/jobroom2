import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../../shared/job-search/service/occupation.service';
import { TypeaheadMultiselectModel } from '../../../shared/input-components';

@Component({
    selector: 'jr2-job-publication-tool',
    templateUrl: './job-publication-tool.component.html',
    styleUrls: []
})
export class JobPublicationToolComponent implements OnInit {
    fetchOccupationSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.fetchSuggestions(query);

    constructor(private occupationService: OccupationService) {
    }

    ngOnInit(): void {
    }
}
