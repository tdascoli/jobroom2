import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateSearchToolComponent } from '../../../../../../../main/webapp/app/home/tools/candidate-search-tool/candidate-search-tool.component';
import { LocalityService } from '../../../../../../../main/webapp/app/shared/reference-service/locality.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';
import { CantonService } from '../../../../../../../main/webapp/app/candidate-search/services/canton.service';
import { OccupationPresentationService } from '../../../../../../../main/webapp/app/shared/reference-service/occupation-presentation.service';

describe('CandidateSearchToolComponent', () => {
    let component: CandidateSearchToolComponent;
    let fixture: ComponentFixture<CandidateSearchToolComponent>;

    const mockOccupationPresentationService = jasmine.createSpyObj('mockOccupationPresentationService',
        ['fetchOccupationSuggestions', 'occupationFormatter']);
    const mockLocalityService = jasmine.createSpyObj('mockLocalityService', ['fetchSuggestions']);
    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    const mockCantonService = jasmine.createSpyObj('mockCantonService', ['getCantonOptions']);
    mockStore.select.and.returnValue(Observable.of([]));

    const zurichCanton = {
        id: 'ZH',
        name: 'Zurich'
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [CandidateSearchToolComponent],
            providers: [
                {
                    provide: OccupationPresentationService,
                    useValue: mockOccupationPresentationService
                },
                { provide: LocalityService, useValue: mockLocalityService },
                { provide: Store, useValue: mockStore },
                { provide: CantonService, useValue: mockCantonService }
            ]
        }).overrideTemplate(CandidateSearchToolComponent, '').compileComponents();

        mockCantonService.getCantonOptions.and.returnValue(Observable.of([zurichCanton]));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateSearchToolComponent);
        component = fixture.componentInstance;
        component.candidateSearchToolModel = initialState;
        fixture.detectChanges();
    });

    it('should be created', async(() => {
        expect(component).toBeTruthy();
    }));
});
