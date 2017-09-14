import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarItemComponent } from '../../../../../../main/webapp/app/home/toolbar-item/toolbar-item.component';

describe('ToolbarItemComponent', () => {
    let component: ToolbarItemComponent;
    let fixture: ComponentFixture<ToolbarItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [ToolbarItemComponent]
            })
            .overrideTemplate(ToolbarItemComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
