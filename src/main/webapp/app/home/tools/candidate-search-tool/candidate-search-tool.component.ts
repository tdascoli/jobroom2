import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../../shared/job-search/service/occupation.service';
import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';

@Component({
  selector: 'jr2-candidate-search-tool',
  templateUrl: './candidate-search-tool.component.html',
  styleUrls: []
})
export class CandidateSearchToolComponent implements OnInit {
    fetchOccupationSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.getOccupations(query);

    constructor(private occupationService: OccupationService) {
    }

    ngOnInit(): void {
    }
}
