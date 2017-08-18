import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { LocalityService } from '../service/locality.service';
import { GeoPoint, Locality } from '../service/locality';

@Component({
    selector: 'jr2-geo-location-select',
    templateUrl: './geo-location-select.component.html',
    styleUrls: ['./geo-location-select.component.scss']
})
export class GeoLocationSelectComponent implements OnInit {
    private geoPoint: GeoPoint;
    private loading = false;
    private lastLocality: Locality;

    @Output() localitySelect = new EventEmitter<Locality>();
    @Input() tooltip;

    constructor(private localityService: LocalityService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.localityService.getCurrentPosition()
            .subscribe((p: GeoPoint) => {
                this.geoPoint = p;
                this.changeDetectorRef.markForCheck();
            }, (error: any) => {
                // Nothing to do, the selector button stays hidden.
            });

    }

    getLocation() {
        if (!this.loading) {
            this.loading = true;
            setTimeout(() => {
                this.localityService.getNearestLocality(this.geoPoint)
                    .subscribe((locality: Locality) => {
                        this.localitySelect.emit(locality);
                        this.lastLocality = locality;
                        this.loading = false;
                    }, (error: any) => {
                        this.loading = false;
                    });
            }, 500);
        }
    }

    isVisible(): boolean {
        return !!this.geoPoint;
    }
}
