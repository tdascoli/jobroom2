import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolsContentComponent, ToolsTab } from '../../../../../../main/webapp/app/home/tools-content/tools-content.component';

describe('ToolsContentComponent', () => {
    let component: ToolsContentComponent;
    let fixture: ComponentFixture<ToolsContentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [ToolsContentComponent]
            })
            .overrideTemplate(ToolsContentComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolsContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should be possible to select the tabs order (CandidateSearch first)', () => {
        // GIVEN
        component.activeTab = ToolsTab.CandidateSearch;

        // WHEN
        component.reorganizeTabs();

        // THEN
        expect(component.tabs[0].type).toEqual(ToolsTab.CandidateSearch);
    });

    it('should be possible to select the tabs order (JobPublication first)', () => {
        // GIVEN
        component.activeTab = ToolsTab.JobPublication;

        // WHEN
        component.reorganizeTabs();

        // THEN
        expect(component.tabs[0].type).toEqual(ToolsTab.JobPublication);
    });

    it('should select JobPublication tab as default when no one given', () => {
        // GIVEN

        // WHEN
        component.reorganizeTabs();

        // THEN
        expect(component.tabs[0].type).toEqual(ToolsTab.JobPublication);
    });
});
