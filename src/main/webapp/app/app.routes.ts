import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'admin',
        loadChildren: './admin/admin.module#JobroomAdminModule'
    },
    {
        path: 'home',
        loadChildren: './home/home.module#JobroomHomeModule'
    },
    {
        path: 'job-search',
        loadChildren: './job-search/job-search.module#JobSearchModule'
    },
    {
        path: 'candidate-search',
        loadChildren: './candidate-search/candidate-search.module#CandidateSearchModule'
    }
];
