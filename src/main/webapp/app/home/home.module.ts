import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { CandidateSearchModule } from '../candidate-search/candidate-search.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ZipCodeComponent } from './tools/job-publication-tool/zip-code/zip-code.component';
import { LanguageSkillsComponent } from './tools/job-publication-tool/language-skills/language-skills.component';
import { HomeRoutingModule } from './home-routing.module';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { HomeRouterEffects } from './state-management/effects/router.effects';
import { JobPublicationResolverService } from './job-publication-resolver.service';

@NgModule({
    imports: [
        JobroomSharedModule,
        JobSearchSharedModule,
        CandidateSearchModule,
        ReactiveFormsModule,
        StoreModule.forFeature('home', homeReducers),
        EffectsModule.forFeature([HomeEffects, HomeRouterEffects]),
        HomeRoutingModule,
        StoreRouterConnectingModule,
        MultiselectDropdownModule
    ],
    declarations: [
        HomeComponent,
        JobSearchToolComponent,
        CandidateSearchToolComponent,
        JobPublicationToolComponent,
        ToolbarComponent,
        ToolbarItemComponent,
        LanguageSkillsComponent,
        ZipCodeComponent
    ],
    entryComponents: [],
    providers: [JobPublicationResolverService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobroomHomeModule {
}
