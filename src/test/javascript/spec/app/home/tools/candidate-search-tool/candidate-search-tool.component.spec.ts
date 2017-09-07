import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateSearchToolComponent } from '../../../../../../../main/webapp/app/home/tools/candidate-search-tool/candidate-search-tool.component';
import { OccupationService } from '../../../../../../../main/webapp/app/shared/job-search/service/occupation.service';

describe('CandidateSearchToolComponent', () => {
    let component: CandidateSearchToolComponent;
    let fixture: ComponentFixture<CandidateSearchToolComponent>;
    const mockOccupationService = jasmine.createSpyObj('mockOccupationService', ['fetchSuggestions']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CandidateSearchToolComponent],
            providers: [
                { provide: OccupationService, useValue: mockOccupationService }
            ]
        })
            .overrideTemplate(CandidateSearchToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateSearchToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
