import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobSearchComponent } from '../../../../../main/webapp/app/job-search/job-search.component';
import { JobroomTestModule } from '../../test.module';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { JobroomSharedLibsModule } from '../../../../../main/webapp/app/shared';

describe('JobSearchComponent', () => {
    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    mockStore.select.and.returnValue(Observable.of([]));

    let component: JobSearchComponent;
    let fixture: ComponentFixture<JobSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule, JobroomSharedLibsModule],
            declarations: [JobSearchComponent],
            providers: [
                { provide: Store, useValue: mockStore },
            ]
        })
            .overrideTemplate(JobSearchComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
