export class VersionInfo {
    name: string;
    artifact: string;
    group: string;
    buildNumber: string;
    buildTime: Date;
    branch: string;

    constructor(public version?: string) {
    }
}
