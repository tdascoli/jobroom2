import { Component, OnInit } from '@angular/core';
import { VersionService } from './version.service';
import { VersionInfo } from './version-info.model';

@Component({
    selector: 'jr2-version',
    template: `
        <div class="version">Version:
            <span>{{versionInfo.version}}.{{versionInfo.buildNumber}} ({{versionInfo.buildTime | date:'short'}})</span>
        </div>`,
    styleUrls: [
        './version.scss'
    ]
})
export class VersionComponent implements OnInit {

    versionInfo: VersionInfo;

    constructor(private versionService: VersionService) {
    }

    ngOnInit() {
        this.versionService.getVersionInfo().subscribe((versionInfo) => {
            this.versionInfo = versionInfo;
        });
    }
}
