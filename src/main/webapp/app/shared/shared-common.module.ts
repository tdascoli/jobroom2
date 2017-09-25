import { LOCALE_ID, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';

import {
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLanguageHelper,
    JobroomSharedLibsModule
} from './';
import { RangeInputComponent, TypeaheadMultiselectComponent } from './input-components';

@NgModule({
    imports: [
        JobroomSharedLibsModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TypeaheadMultiselectComponent,
        RangeInputComponent
    ],
    providers: [
        JhiLanguageHelper,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'de'
        },
    ],
    exports: [
        JobroomSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TypeaheadMultiselectComponent,
        RangeInputComponent
    ]
})
export class JobroomSharedCommonModule {
}
