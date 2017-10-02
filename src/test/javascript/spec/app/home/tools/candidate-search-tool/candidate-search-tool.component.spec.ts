import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateSearchToolComponent } from '../../../../../../../main/webapp/app/home/tools/candidate-search-tool/candidate-search-tool.component';
import { OccupationService } from '../../../../../../../main/webapp/app/shared/reference-service/occupation.service';
import { LocalityService } from '../../../../../../../main/webapp/app/shared/reference-service/locality.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';

describe('CandidateSearchToolComponent', () => {
    let component: CandidateSearchToolComponent;
    let fixture: ComponentFixture<CandidateSearchToolComponent>;

    const mockOccupationService = jasmine.createSpyObj('mockOccupationService', ['fetchSuggestions']);
    const mockLocalityService = jasmine.createSpyObj('mockLocalityService', ['fetchSuggestions']);
    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    mockStore.select.and.returnValue(Observable.of([]));

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [CandidateSearchToolComponent],
            providers: [
                { provide: OccupationService, useValue: mockOccupationService },
                { provide: LocalityService, useValue: mockLocalityService },
                { provide: Store, useValue: mockStore }
            ]
        })
            .overrideTemplate(CandidateSearchToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateSearchToolComponent);
        component = fixture.componentInstance;
        component.candidateSearchToolModel = initialState;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
