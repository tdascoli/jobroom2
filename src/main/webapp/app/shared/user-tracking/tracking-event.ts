export class TrackingItem {
    locale?: string;
    trackingId?: string;

    constructor(public event: string, public data: { [key: string]: any; }) {
    }
}
