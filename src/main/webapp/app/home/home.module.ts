import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { JobroomSharedModule, JobSearchSharedModule } from '../shared';
import { HOME_ROUTE, HomeComponent } from './';
import { JobSearchToolComponent } from './tools/job-search-tool/job-search-tool.component';
import { CandidateSearchToolComponent } from './tools/candidate-search-tool/candidate-search-tool.component';
import { JobPublicationToolComponent } from './tools/job-publication-tool/job-publication-tool.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarItemComponent } from './toolbar-item/toolbar-item.component';
import { StoreModule } from '@ngrx/store';
import { HomeEffects, homeReducers } from './state-management';
import { EffectsModule } from '@ngrx/effects';
import { CandidateSearchModule } from '../candidate-search/candidate-search.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { LanguageSkillsComponent } from './tools/job-publication-tool/language-skills/language-skills.component';

@NgModule({
    imports: [
        JobroomSharedModule,
        JobSearchSharedModule,
        CandidateSearchModule,
        ReactiveFormsModule,
        StoreModule.forFeature('home', homeReducers),
        EffectsModule.forFeature([HomeEffects]),
        RouterModule.forRoot([HOME_ROUTE], { useHash: true }),
        MultiselectDropdownModule
    ],
    declarations: [
        HomeComponent,
        JobSearchToolComponent,
        CandidateSearchToolComponent,
        JobPublicationToolComponent,
        ToolbarComponent,
        ToolbarItemComponent,
        LanguageSkillsComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobroomHomeModule {
}
