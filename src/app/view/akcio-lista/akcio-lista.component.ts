import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AdatServiceService } from '../../adat-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { BOLTOK } from '../../common.constants';
import { Component, computed, effect, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AkcioTetel } from '../../model/akcio-tetel.type';
import { AkcioTetelIF } from '../../model/akcio-tetel.interface';
import { AkciosLista } from '../../model/akcios-lista.type';
import { BoltAzon } from '../../model/bolt-azon.enum';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-akcio-lista',
    standalone: true,
    imports: [ButtonModule, InputTextModule, FormsModule, NgClass],
    templateUrl: './akcio-lista.component.html',
    styleUrl: './akcio-lista.component.scss'
})
export class AkcioListaComponent {

    loading: boolean = false;
    // boltok = BoltAzon;
    boltok = BOLTOK;

    keresoGombSzoveg = signal<'Mind' | 'Mai' | 'Lehet'>('Mind');
    boltSzuro = signal<BoltAzon[]>([]);
    szuroSzoveg = signal<string>('');

    // BOLTOK - IDŐSZAKOK - tétel lista
    public tetelAdatok: Map<string, Map<string, AkcioTetel[]>> = new Map<string, Map<string, AkcioTetel[]>>();

    akciosListakLista: AkciosLista[] = [];
    kivalasztottAkciosLista: AkciosLista = null;

    // searchTerm = signal('');
    // searchFor = toSignal(toObservable(this.searchTerm).pipe(debounceTime(1000)), {
    //     initialValue: '',
    // });

    public _keresoSzoveg: any = null;
    public get keresoSzoveg(): any {
        return this._keresoSzoveg;
    }
    public set keresoSzoveg(newValue: any) {
        this._keresoSzoveg = newValue;
        console.debug('AkcioListaComponent - kereső szöveg változott ', newValue);
    }

    kivalasztottListaTetelei = computed<AkcioTetel[]>(() => {
        const kivalasztottLista = this.adatServiceService.kivalasztottLista();
        const fullLista = this.adatServiceService.akciosTetelLista();
        const keresesiIdo = this.keresoGombSzoveg();
        const boltSzuro = this.boltSzuro();
        const szuroSzoveg = this.szuroSzoveg();

        // console.debug('AkcioListaComponent - kivalasztottListaTetelei ', kivalasztottLista, fullLista);
        if (kivalasztottLista && fullLista && fullLista.length > 0) {
            let hetiLista = this.adatServiceService.akciosTetelLista().filter(tetel => tetel.listaAzon == kivalasztottLista.azon &&
                (this.boltSzuro().length === 0 || (this.boltSzuro().findIndex(sz => sz == tetel.boltAzon) > -1)) &&
                (szuroSzoveg.length < 1 || (tetel.nev.indexOf(szuroSzoveg) > -1)));
            console.debug('AkcioListaComponent - heti lista ', hetiLista, keresesiIdo, boltSzuro, szuroSzoveg);
            return hetiLista;
        } else {
            return [];
        }
    });

    // kivalasztottListaChangeEffect = effect(() => {
    //     console.debug('AkcioListaComponent - kivalasztottListaChangeEffect: ', this.adatServiceService.kivalasztottLista());
    // });

    // kivalasztottListaTeteleiChangeEffect = effect(() => {
    //     console.debug('AkcioListaComponent - kivalasztottListaTeteleiChangeEffect: ', this.kivalasztottListaTetelei());
    // });

    constructor(private adatServiceService: AdatServiceService, private fireAuthService: FireAuthService) { }


    ngOnInit() {
    }

    load() {
        this.loading = true;

        setTimeout(() => {
            this.loading = false;
            this.fireAuthService.logout();
        }, 2000);
    }

    boltSzuroKlikk(bolt: any): void {
        console.debug('AkcioListaComponent - boltSzuroKlikk: ', bolt);
        const boltSzuro = this.boltSzuro();
        if (boltSzuro.indexOf(bolt.id) > -1) {
            const ujLista = boltSzuro.filter(value => value !== bolt.id);
            console.debug('AkcioListaComponent - boltSzuroKlikk: ', ujLista);
            this.boltSzuro.set(ujLista);
        } else {
            const ujLista = boltSzuro.concat([bolt.id])
            this.boltSzuro.set(ujLista);
        }
    }

    ezKijeloltBolt(bolt: any): boolean {
        return this.boltSzuro().indexOf(bolt.id) > -1;
    }

    rotalas(): void {
        if (this.keresoGombSzoveg() === 'Mind') {
            this.keresoGombSzoveg.set('Mai');
        } else if (this.keresoGombSzoveg() === 'Mai') {
            this.keresoGombSzoveg.set('Lehet')
        } else {
            this.keresoGombSzoveg.set('Mind')
        }
    }

    szuroTorles(): void {
        console.debug('AkcioListaComponent - szuroTorles');
        this.szuroSzoveg.set('');
        this.boltSzuro.set([]);
    }

    // késleltetett bevitel esetén minta megoldás
    // kereses(event: any): void {
    //     console.debug('AkcioListaComponent - kereses ', event);
    //     this.searchTerm.set(event);

    // }



}



