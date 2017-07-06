import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

const jobDescriptions = [
    'Kundenberater Hypotheken',
    'Avaloq-Entwickler',
    'Assistent Compliance Officer',
    'Sachbearbeiter',
    'Medizinisch-technischer Assistent',
    'Wissenschaftlicher Sekretär',
    'Fabrikationsmitarbeiter',
    'Leiter des Schulsekretariates',
    'Wärmepumpenfachmann',
    'Verpackungsassistent',
    'Assistent Leiter Management Support',
    'Offsetdrucker',
    'Sachbearbeiter Retouren',
    'Zugverkehrsleiter',
    'Regulatory Affairs Specialist',
    'Redaktionsassistent',
    'Kleiderverkäufer',
    'Leiter E-Marketing',
    'Schulratspräsident',
    'Mitarbeiter Werkhof',
    'Schulassistent',
    'Fahrzeug-Aufbereiter',
    'Schleifer',
    'Leiter Betreibungsamt',
    'Musiklehrer',
    'Sachbearbeiter Soziale Dienste',
    'Leiter Reinigung',
    'Hauswirtschaftslehrer',
    'Integrationsbeauftragter',
    'Leiter Wohngruppe',
    'Medizinischer Codierer',
    'Zerspanungsfachmann',
    'Leiter Aktuariat',
    'Baukoordinator',
    'Energieingenieur',
    'Statiker',
    'Trockenbauer',
    'Leiter Werkzeugtechnik',
    'Reifenmonteur',
    'Dammingenieur',
    'Leittechnik-Ingenieur',
    'Sendetechniker',
    'Medizinphysiker',
    'Bahnpolizist',
    'Papeterist',
    'Python-Entwickler',
    'Leiter SAP',
    'Steuerrechtsspezialist',
    'Host/PL1 Spezialist',
    'SPS Software-Ingenieur',
    'Leiter Projekt-Controlling',
    'Bibliotheksleiter',
    'Leiter Gerüstbau',
    'Zeitungsverteiler',
    'Sachbearbeiter Valorenstammdaten',
    'TYPO3-Entwickler',
    'Assistent Facility Management',
    'Assistent Produktentwicklung',
    'Assistent Asset Management',
    'Assistent der Bankleitung',
    'Assistent Disposition',
    'Assistent Stab',
    'Ausgrabungsleiter',
    'Bauarbeiter',
    'Cobol-Entwickler',
    'Didaktiker',
    'Leiter Release Management',
    'Sachbearbeiter Versand',
    'Konstruktionsassistent',
    'Leiter Finanzberatung',
    'Leiter Fachbereich Gesundheit',
    'Leiter Handel',
    'Leiter psychologischer Fachdienst',
    'Leiter Zoll',
    'Leiter Stadtplanung',
    'Leiter Hypothekargeschäft',
    'Leiter Telefon und Empfang',
    'Leiter Mechanik',
    'Systemingenieur Tivoli',
    'Mitarbeiter IT-Zugriffsmanagement',
    'Mitarbeiter Patientenadministratio'
];

// todo: Fix component name
@Component({
    selector: 'jhi-job-search',
    templateUrl: './job-search.component.html'
})
export class JobSearchComponent implements OnInit {
    term: any;

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    loadJobs = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map((currentTerm) => currentTerm.length < 2 ? []
                : jobDescriptions.filter((v) => v.toLowerCase().indexOf(currentTerm.toLowerCase()) > -1).slice(0, 10));

    search() {
        this.router.navigate(['/job-search'], { queryParams: { term: this.term } });
    }
}
