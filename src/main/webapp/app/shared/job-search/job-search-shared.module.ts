import { NgModule } from '@angular/core';
import { OccupationService } from './service/occupation.service';
import { TypeaheadMultiselectComponent } from './typeahead-multiselect/typeahead-multiselect.component';
import { JobroomSharedLibsModule } from '../shared-libs.module';

@NgModule({
    imports: [
        JobroomSharedLibsModule
    ],
    exports: [
        TypeaheadMultiselectComponent
    ],
    declarations: [
        TypeaheadMultiselectComponent
    ],
    providers: [
        OccupationService
    ]
})
export class JobSearchSharedModule {
}
