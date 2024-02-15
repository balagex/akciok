import { Component, Input, computed, effect } from '@angular/core';
import { AdatServiceService } from '../../adat-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { AkciosLista } from '../../model/akcios-lista.type';
import { AkcioTetel } from '../../model/akcio-tetel.type';
import { dateToYYYYMMDD, napRovidites } from '../../utils';
import { BOLTOK } from '../../common.constants';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-akcio-tetel-szerkeszto',
    standalone: true,
    imports: [ConfirmPopupModule, ButtonModule, FormsModule, NgClass, InputTextModule],
    providers: [ConfirmationService],
    templateUrl: './akcio-tetel-szerkeszto.component.html',
    styleUrl: './akcio-tetel-szerkeszto.component.scss'
})
export class AkcioTetelSzerkesztoComponent {

    @Input() mobilE: boolean = false;

    boltok = BOLTOK;
    kivalasztottBolt: any = BOLTOK[1];

    intervallumStart: Date = null;
    intervallumEnd: Date = null;
    tetelStart: Date = null;
    tetelEnd: Date = null;
    ujTetel: boolean = false;

    kivalasztottLista = computed<AkciosLista>(() => {
        return this.adatServiceService.kivalasztottLista();
    });

    kivalasztottTetel = computed<AkcioTetel>(() => {
        return this.adatServiceService.kivalasztottTetel();
    });

    constructor(private adatServiceService: AdatServiceService, private fireAuthService: FireAuthService, private confirmationService: ConfirmationService) {

        effect(() => {
            console.log('AkcioTetelSzerkesztoComponent - kivalasztottLista változás ', this.adatServiceService.kivalasztottLista());
            if (this.adatServiceService.kivalasztottLista()) {
                this.intervallumStart = this.adatServiceService.kivalasztottLista().kezdoNap;
                this.intervallumEnd = this.adatServiceService.kivalasztottLista().vegeNap;
            } else {
                this.intervallumStart = null;
                this.intervallumEnd = null;
            }
        });

        effect(() => {
            console.log('AkcioTetelSzerkesztoComponent - kivalasztottTetel változás ', this.adatServiceService.kivalasztottTetel());
            if (this.adatServiceService.kivalasztottTetel()) {
                this.tetelStart = this.adatServiceService.kivalasztottTetel().kezdoNap;
                this.tetelEnd = this.adatServiceService.kivalasztottTetel().vegeNap;
                if (this.adatServiceService.akciosTetelLista().findIndex(t => t.azon == this.adatServiceService.kivalasztottTetel().azon) > 0) {
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
            }
        });
    }


    ujTetelFelvetelInditas(): void {
        const ujTetel: AkcioTetel = new AkcioTetel();
        ujTetel.listaAzon = this.adatServiceService.kivalasztottLista()?.azon;
        ujTetel.kezdoNap = this.adatServiceService.kivalasztottLista()?.kezdoNap;
        ujTetel.vegeNap = this.adatServiceService.kivalasztottLista()?.vegeNap;
        ujTetel.kezdoNapNevRov = napRovidites(ujTetel.kezdoNap, 'hu-HU');
        ujTetel.vegeNapNevRov = napRovidites(ujTetel.vegeNap, 'hu-HU');
        ujTetel.intervallum = dateToYYYYMMDD(ujTetel.kezdoNap) + '-' + dateToYYYYMMDD(ujTetel.vegeNap);
        console.debug('AkcioTetelSzerkesztoComponent - ujTetelFelvetelInditas...', ujTetel);

        this.adatServiceService.kivalasztottTetel.set(ujTetel);
    }

    ujTetelMentes(): void {
        console.debug('AkcioTetelSzerkesztoComponent - ujTetelMentes...', this.adatServiceService.kivalasztottTetel());
    }

    tetelModositas(): void {
        console.debug('AkcioTetelSzerkesztoComponent - tetelModositas...', this.adatServiceService.kivalasztottTetel(), this.adatServiceService.akciosTetelLista());
    }

    tetelTorles(): void {
        console.debug('AkcioTetelSzerkesztoComponent - tetelTorles...', this.adatServiceService.kivalasztottTetel());
    }

    boltValasztas(bolt: any): void {
        console.debug('AkcioTetelSzerkesztoComponent - boltValasztas', bolt, this.ujTetel);
        if (this.ujTetel && bolt && bolt.id && this.adatServiceService.kivalasztottTetel().boltAzon != bolt.id) {
            const ujTetel = this.adatServiceService.kivalasztottTetel();
            ujTetel.boltAzon = bolt.id;
            this.adatServiceService.kivalasztottTetel.set(ujTetel);
        }
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
}
