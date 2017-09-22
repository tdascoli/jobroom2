import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { JobroomSharedModule, JobSearchSharedModule } from '../shared';
import { HomeComponent } from './';
import { JobSearchToolComponent } from './tools/job-search-tool/job-search-tool.component';
import { CandidateSearchToolComponent } from './tools/candidate-search-tool/candidate-search-tool.component';
import { JobPublicationToolComponent } from './tools/job-publication-tool/job-publication-tool.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarItemComponent } from './toolbar-item/toolbar-item.component';
import { StoreModule } from '@ngrx/store';
import { HomeEffects, homeReducers } from './state-management';
import { EffectsModule } from '@ngrx/effects';
import { JhiLanguageService } from 'ng-jhipster';
import { HOME_ROUTES } from './home.routes';

@NgModule({
    imports: [
        JobroomSharedModule,
        JobSearchSharedModule,
        ReactiveFormsModule,
        StoreModule.forFeature('home', homeReducers),
        EffectsModule.forFeature([HomeEffects]),
        RouterModule.forChild(HOME_ROUTES)
    ],
    declarations: [
        HomeComponent,
        JobSearchToolComponent,
        CandidateSearchToolComponent,
        JobPublicationToolComponent,
        ToolbarComponent,
        ToolbarItemComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobroomHomeModule {
    constructor(languageService: JhiLanguageService) {
        languageService.init();
    }
}
