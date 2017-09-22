import { Routes } from '@angular/router';
import { JobSearchComponent } from './job-search.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobDetailResolver } from './job-detail/job-detail.resolver';

export const JOB_SEARCH_ROUTES: Routes = [
    {
        path: '',
        component: JobSearchComponent,
        data: {
            authorities: [],
            pageTitle: 'job-search.title'
        }
    },
    {
        path: 'job-detail/:id',
        component: JobDetailComponent,
        resolve: {
            job: JobDetailResolver
        },
        data: {
            authorities: [],
            pageTitle: 'job-detail.title'
        }
    }
];
