import { NgModule } from '@angular/core';
import { OccupationService } from './service/occupation.service';
import { TypeaheadMultiselectComponent } from './typeahead-multiselect/typeahead-multiselect.component';
import { JobroomSharedLibsModule } from '../shared-libs.module';
import { LocalityService } from './service/locality.service';
import { GeoLocationSelectComponent } from './geo-location-select/geo-location-select.component';

@NgModule({
    imports: [
        JobroomSharedLibsModule
    ],
    exports: [
        TypeaheadMultiselectComponent,
        GeoLocationSelectComponent
    ],
    declarations: [
        TypeaheadMultiselectComponent,
        GeoLocationSelectComponent
    ],
    providers: [
        OccupationService,
        LocalityService
    ]
})
export class JobSearchSharedModule {
}
