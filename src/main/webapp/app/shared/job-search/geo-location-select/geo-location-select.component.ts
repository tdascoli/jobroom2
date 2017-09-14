import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { LocalityService } from '../service/locality.service';
import { GeoPoint, LocalitySuggestion } from '../service/locality-autocomplete';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jr2-geo-location-select',
    templateUrl: './geo-location-select.component.html',
    styleUrls: ['./geo-location-select.component.scss']
})
export class GeoLocationSelectComponent implements OnInit, OnDestroy {
    @Output() localitySelect = new EventEmitter<LocalitySuggestion>();
    @Input() tooltip;

    private geoPoint: GeoPoint;
    private loading = false;
    private lastLocality: LocalitySuggestion;
    private subscription: Subscription;

    constructor(private localityService: LocalityService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.subscription = this.localityService.getCurrentPosition()
            .subscribe((p: GeoPoint) => {
                this.geoPoint = p;
                this.changeDetectorRef.markForCheck();
            }, (error: any) => {
                // Nothing to do, the selector button stays hidden.
            });

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getLocation() {
        if (!this.loading) {
            this.loading = true;
            setTimeout(() => {
                this.localityService.getNearestLocality(this.geoPoint)
                    .subscribe((locality: LocalitySuggestion) => {
                            this.localitySelect.emit(locality);
                            this.lastLocality = locality;
                        }, (error: any) => {
                        },
                        () => {
                            this.loading = false;
                            this.changeDetectorRef.markForCheck();
                        });
            }, 500);
        }
        return false;
    }

    isVisible(): boolean {
        return !!this.geoPoint;
    }
}
