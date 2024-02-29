import { Component, Input, computed, effect } from '@angular/core';
import { AdatServiceService } from '../../adat-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { AkciosLista } from '../../model/akcios-lista.type';
import { AkcioTetel } from '../../model/akcio-tetel.type';
import { dateToYYYYMMDD, intervallDates, napRovidites } from '../../utils';
import { BOLTOK } from '../../common.constants';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { NapValasztoComponent } from '../nap-valaszto/nap-valaszto.component';
import { CheckboxModule } from 'primeng/checkbox';
import { BoltAzon } from '../../model/bolt-azon.enum';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';


@Component({
    selector: 'app-akcio-tetel-szerkeszto',
    standalone: true,
    imports: [ConfirmPopupModule, ButtonModule, FormsModule, NgClass, InputTextModule, NapValasztoComponent, CheckboxModule, AutoCompleteModule],
    providers: [ConfirmationService],
    templateUrl: './akcio-tetel-szerkeszto.component.html',
    styleUrl: './akcio-tetel-szerkeszto.component.scss'
})
export class AkcioTetelSzerkesztoComponent {

    @Input() mobilE: boolean = false;

    boltok = BOLTOK;
    kivalasztottBolt: any = null;

    intervallumStart: Date = null;
    intervallumEnd: Date = null;
    intervallumStr: string = null;
    intervallumDatumok: Date[] = [];
    tetelStart: Date = null;
    tetelEnd: Date = null;
    ujTetel: boolean = false;
    tetelNev: string = null;
    tetelMegjegyzes: string = null;
    tetelKiemeltE: boolean = false;

    nevDarabok: string[] = [];
    szurtNevDarabok: string[] = [];

    // azon: string;
    // listaAzon: string;
    // boltAzon: BoltAzon;
    // kezdoNap: Date;
    // kezdoNapNevRov: string;
    // vegeNap: Date;
    // vegeNapNevRov: string;
    // intervallum: string;
    // nev: string;
    // kiemeltE: boolean;
    // megjegyzes?: string;

    kivalasztottLista = computed<AkciosLista>(() => {
        return this.adatServiceService.kivalasztottLista();
    });

    kivalasztottTetel = computed<AkcioTetel>(() => {
        return this.adatServiceService.kivalasztottTetel();
    });

    vanMentendoTetel = computed<boolean>(() => {
        const tetelek = this.adatServiceService.akciosTetelLista();
        return tetelek && tetelek.length > 0 && tetelek.findIndex(t => t.mentendo) > -1;
    });

    constructor(private adatServiceService: AdatServiceService, private fireAuthService: FireAuthService, private confirmationService: ConfirmationService) {

        effect(() => {
            console.log('AkcioTetelSzerkesztoComponent - kivalasztottLista változás ', this.adatServiceService.kivalasztottLista());
            if (this.adatServiceService.kivalasztottLista()) {
                this.intervallumStart = this.adatServiceService.kivalasztottLista().kezdoNap;
                this.intervallumEnd = this.adatServiceService.kivalasztottLista().vegeNap;
                this.intervallumStr = dateToYYYYMMDD(this.intervallumStart) + '-' + dateToYYYYMMDD(this.intervallumEnd);
                this.intervallumDatumok = intervallDates(this.intervallumStart, this.intervallumEnd);
                console.log('AkcioTetelSzerkesztoComponent - DÁTUMOK ', this.intervallumStart, this.intervallumEnd, this.intervallumDatumok);
            } else {
                this.intervallumStart = null;
                this.intervallumEnd = null;
                this.intervallumStr = null;
                this.intervallumDatumok = [];
            }
        });

        effect(() => {
            console.log('AkcioTetelSzerkesztoComponent - kivalasztottTetel változás ', this.adatServiceService.kivalasztottTetel());
            if (this.adatServiceService.kivalasztottTetel()) {
                this.tetelStart = this.adatServiceService.kivalasztottTetel().kezdoNap;
                this.tetelEnd = this.adatServiceService.kivalasztottTetel().vegeNap;
                this.tetelNev = this.adatServiceService.kivalasztottTetel().nev;
                this.tetelMegjegyzes = this.adatServiceService.kivalasztottTetel().megjegyzes;
                this.tetelKiemeltE = this.adatServiceService.kivalasztottTetel().kiemeltE;
                this.kivalasztottBolt = this.boltok.find(b => b.id == this.adatServiceService.kivalasztottTetel().boltAzon);
                if (this.adatServiceService.akciosTetelLista().findIndex(t => t.azon == this.adatServiceService.kivalasztottTetel().azon) > -1) {
                    console.log('AkcioTetelSzerkesztoComponent - meglévő tétel kiválasztás ');
                    this.ujTetel = false;
                } else {
                    console.log('AkcioTetelSzerkesztoComponent - új tétel kiválasztás ');
                    this.ujTetel = true;
                }
            } else {
                this.tetelStart = null;
                this.tetelEnd = null;
                this.ujTetel = false;
                this.tetelNev = null;
                this.tetelMegjegyzes = null;
                this.tetelKiemeltE = false;
                this.kivalasztottBolt = null;
            }
        });

        effect(() => {
            console.log('AkcioTetelSzerkesztoComponent - tétel lista változás ', this.adatServiceService.akciosTetelLista());
            const darabok: Map<string, string> = new Map<string, string>();
            this.adatServiceService.akciosTetelLista().forEach(tetel => {
                const nevReszek: string[] = tetel.nev?.split(/\s+/);
                if (nevReszek) {
                    nevReszek.forEach(nd => {
                        if (!darabok.has(nd)) {
                            darabok.set(nd, nd);
                        }
                    });
                }
            });
            console.debug('AkcioTetelSzerkesztoComponent - név darabok', darabok);
            this.nevDarabok = Array.from(darabok.keys());
        });
    }


    ujTetelFelvetelInditas(bolt: BoltAzon, start: Date, end: Date): void {
        const ujTetel: AkcioTetel = new AkcioTetel();
        if (bolt) {
            ujTetel.boltAzon = bolt;
        }
        ujTetel.listaAzon = this.adatServiceService.kivalasztottLista()?.azon;
        ujTetel.kezdoNap = start ? start : this.adatServiceService.kivalasztottLista()?.kezdoNap;
        ujTetel.vegeNap = end ? end : this.adatServiceService.kivalasztottLista()?.vegeNap;
        ujTetel.kezdoNapNevRov = napRovidites(ujTetel.kezdoNap, 'hu-HU');
        ujTetel.vegeNapNevRov = napRovidites(ujTetel.vegeNap, 'hu-HU');
        ujTetel.intervallum = dateToYYYYMMDD(ujTetel.kezdoNap) + '-' + dateToYYYYMMDD(ujTetel.vegeNap);
        ujTetel.mentendo = true;
        console.debug('AkcioTetelSzerkesztoComponent - ujTetelFelvetelInditas...', ujTetel);

        this.adatServiceService.kivalasztottTetel.set(ujTetel);
    }

    ujTetelMentes(): void {
        console.debug('AkcioTetelSzerkesztoComponent - ujTetelMentes...', this.adatServiceService.kivalasztottTetel(), this.tetelNev, this.tetelMegjegyzes, this.tetelKiemeltE, this.kivalasztottBolt);
        this.tetelMentendoLesz(true);
    }

    tetelModositas(): void {
        console.debug('AkcioTetelSzerkesztoComponent - tetelModositas...', this.adatServiceService.kivalasztottTetel(), this.adatServiceService.akciosTetelLista(), this.tetelNev, this.tetelMegjegyzes, this.tetelKiemeltE, this.kivalasztottBolt);
        this.tetelMentendoLesz(false);
    }

    tetelMentendoLesz(ujTetel: boolean): void {
        console.debug('AkcioTetelSzerkesztoComponent - tetelMentendoLesz...', ujTetel, this.adatServiceService.kivalasztottTetel(), this.adatServiceService.akciosTetelLista(), this.tetelNev, this.tetelMegjegyzes, this.tetelKiemeltE, this.kivalasztottBolt);
        const mentendoTetel = this.adatServiceService.kivalasztottTetel();
        mentendoTetel.boltAzon = this.kivalasztottBolt.id;
        mentendoTetel.nev = this.tetelNev;
        mentendoTetel.megjegyzes = this.tetelMegjegyzes;
        mentendoTetel.kiemeltE = this.tetelKiemeltE;
        mentendoTetel.kezdoNap = this.tetelStart;
        mentendoTetel.kezdoNapNevRov = napRovidites(this.tetelStart, 'hu-HU');
        mentendoTetel.vegeNap = this.tetelEnd;
        mentendoTetel.vegeNapNevRov = napRovidites(this.tetelEnd, 'hu-HU');
        mentendoTetel.intervallum = dateToYYYYMMDD(this.tetelStart) + '-' + dateToYYYYMMDD(this.tetelEnd);
        mentendoTetel.mentendo = true;
        const tetelek = this.adatServiceService.akciosTetelLista().filter(t => t.azon !== mentendoTetel.azon);
        this.adatServiceService.akciosTetelLista.set(tetelek);
        tetelek.push(mentendoTetel);
        if (ujTetel) {
            this.ujTetelFelvetelInditas(this.kivalasztottBolt?.id, this.tetelStart, this.tetelEnd);
        } else {
            this.adatServiceService.kivalasztottTetel.set(mentendoTetel);
        }

    }

    mentendoAdatokMentese(): void {
        this.adatServiceService.mentendoAdatokMentese(this.fireAuthService.getToken()).subscribe({
            next: (mentettTetelek) => {
                console.debug('AkcioTetelSzerkesztoComponent - A mentendő tételek mentése után lekért akciós tételek: ', mentettTetelek);
            },
            error: (modositasError) => {
                console.error('AkcioTetelSzerkesztoComponent - HIBA AZ AKCIOS TÉTELEK MÓDOSÍTÁSA SORÁN ', modositasError);
                // TODO: kitalálni mi legyen
            }
        });
    }

    tetelTorles(): void {
        console.debug('AkcioTetelSzerkesztoComponent - tetelTorles...', this.adatServiceService.kivalasztottTetel());
    }

    boltValasztas(bolt: any): void {
        console.debug('AkcioTetelSzerkesztoComponent - boltValasztas', bolt, this.ujTetel);
        if (bolt) {
            this.kivalasztottBolt = bolt;
        } else {
            this.kivalasztottBolt = null;
        }
        // if (bolt && bolt.id && this.adatServiceService.kivalasztottTetel().boltAzon != bolt.id) {
        //     const ujTetel = this.adatServiceService.kivalasztottTetel();
        //     ujTetel.boltAzon = bolt.id;
        //     this.adatServiceService.kivalasztottTetel.set(ujTetel);
        // }
        // TODO: meglévő tétel boltját is lehessen módosítani

        // https://stackoverflow.com/questions/76174124/push-in-angular-signals-array

    }

    nevModositas(nev: string): void {
        console.debug('AkcioTetelSzerkesztoComponent - nevModositas', nev, this.ujTetel);
        const ujTetel = this.adatServiceService.kivalasztottTetel();
        ujTetel.nev = nev;
        this.adatServiceService.kivalasztottTetel.set(ujTetel);
        if (this.ujTetel) {

        } else {

        }
    }

    startNapValasztas(nap: Date): void {
        console.debug('AkcioTetelSzerkesztoComponent - startNapValasztas', nap);
        this.tetelStart = nap;
        if (nap > this.tetelEnd) {
            this.tetelEnd = nap;
        }
    }

    endNapValasztas(nap: Date): void {
        console.debug('AkcioTetelSzerkesztoComponent - endNapValasztas', nap);
        this.tetelEnd = nap;
        if (nap < this.tetelStart) {
            this.tetelStart = nap;
        }

    }

    nevSzukites(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;
        if (this.nevDarabok) {
            this.nevDarabok.forEach(darab => {
                if (darab.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                    filtered.push(darab);
                }
            });
        }

        this.szurtNevDarabok = filtered;
    }
}
