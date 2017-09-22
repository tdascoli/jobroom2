import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { VersionInfo } from './version-info.model';

@Injectable()
export class VersionService {

    private versionInfoUrl = 'management/info';

    constructor(private http: Http) {
    }

    getVersionInfo(): Observable<VersionInfo> {
        return this.http.get(this.versionInfoUrl)
            .map((res: Response) => {
                const data = res.json();
                const pi = new VersionInfo('0.0.0-SNAPHOST');
                if (data.build) {
                    pi.version = data.build.version;
                    pi.artifact = data.build.artifact;
                    pi.group = data.build.group;
                    pi.buildTime = data.build.time;
                    pi.buildNumber = data.build.number;
                }
                if (data.git) {
                    pi.branch = data.git.branch;
                }
                return pi;
            });
    }
}
