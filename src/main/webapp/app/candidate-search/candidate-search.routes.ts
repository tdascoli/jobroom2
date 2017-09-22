import { Routes } from '@angular/router';
import { CandidateSearchComponent } from './candidate-search.component';

export const CANDIDATE_SEARCH_ROUTES: Routes = [
    {
        path: '',
        component: CandidateSearchComponent,
        data: {
            authorities: [],
            pageTitle: 'candidate-search.title'
        }
    }
];
