import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { TrackingItem } from './tracking-event';
import { SERVER_API_URL } from '../../app.constants';
import { CookieService } from 'ngx-cookie';

const TRACKING_COOKIE_KEY = '_jr2.ID';

@Injectable()
export class UserTrackingService {
    private resourceUrl = SERVER_API_URL + 'tracking/api/tracking-items';

    trackingId: string;

    static createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        const s = [];
        const hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        /* tslint:disable */

        s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';

        /* tslint:enable */

        const uuid = s.join('');
        return uuid;
    }

    constructor(private http: Http,
                private translateService: TranslateService,
                private cookieService: CookieService) {

        const existingTrackingId = this.cookieService.get(TRACKING_COOKIE_KEY);
        if (existingTrackingId) {
            this.trackingId = existingTrackingId;
        } else {
            const newTrackingId = UserTrackingService.createUUID();
            this.cookieService.put(TRACKING_COOKIE_KEY, newTrackingId);
            this.trackingId = newTrackingId;
        }
    }

    logEvent(event: TrackingItem) {
        const options = new BaseRequestOptions();

        const locale = this.translateService.currentLang;
        const trackingId = this.trackingId;

        const request = Object.assign({}, event, {
            locale,
            trackingId,
            data: JSON.stringify(event.data)
        });

        return this.http.post(this.resourceUrl, request, options)
            .map((resp) => resp.status);
    }
}