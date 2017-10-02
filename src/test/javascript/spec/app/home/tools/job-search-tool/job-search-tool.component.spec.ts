import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { JobSearchToolComponent } from '../../../../../../../main/webapp/app/home/tools/job-search-tool/job-search-tool.component';
import { OccupationService } from '../../../../../../../main/webapp/app/shared/reference-service/occupation.service';
import { LocalityService } from '../../../../../../../main/webapp/app/shared/reference-service/locality.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/job-search-tool.state';

describe('JobSearchToolComponent', () => {
    const mockOccupationService = jasmine.createSpyObj('mockOccupationService', ['fetchSuggestions']);
    const mockLocalityService = jasmine.createSpyObj('mockLocalityService', ['fetchSuggestions']);

    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    mockStore.select.and.returnValue(Observable.of([]));

    let component: JobSearchToolComponent;
    let fixture: ComponentFixture<JobSearchToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [JobSearchToolComponent],
            providers: [
                { provide: OccupationService, useValue: mockOccupationService },
                { provide: LocalityService, useValue: mockLocalityService },
                { provide: Store, useValue: mockStore }
            ]
        })
            .overrideTemplate(JobSearchToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobSearchToolComponent);
        component = fixture.componentInstance;
        component.jobSearchToolModel = initialState;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
