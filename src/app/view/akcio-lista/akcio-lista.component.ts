import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AdatServiceService } from '../../adat-service.service';
import { FireAuthService } from '../../fire-auth.service';
import { BOLTOK } from '../../common.constants';
import { Component, computed, effect } from '@angular/core';

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

    // BOLTOK - IDŐSZAKOK - tétel lista
    public tetelAdatok: Map<string, Map<string, AkcioTetel[]>> = new Map<string, Map<string, AkcioTetel[]>>();

    public boltSzuroMap: Map<BoltAzon, boolean> = new Map<BoltAzon, boolean>([
        [BoltAzon.LIDL, false],
        [BoltAzon.ALDI, false],
        [BoltAzon.SPAR, false],
        [BoltAzon.PENNY, false],
        [BoltAzon.TESCO, false],
        [BoltAzon.AUCHAN, false],
        [BoltAzon.EGYEB, false]
    ]);

    public boltSzuresAktiv: boolean = false;

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
        // console.debug('AkcioListaComponent - kivalasztottListaTetelei ', kivalasztottLista, fullLista);
        if (kivalasztottLista && fullLista && fullLista.length > 0) {
            let hetiLista = this.adatServiceService.akciosTetelLista().filter(tetel => tetel.listaAzon == kivalasztottLista.azon);
            console.debug('AkcioListaComponent - heti lista ', hetiLista);
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
        const boltSzuroErtek: boolean = this.boltSzuroMap.get(bolt.id);
        this.boltSzuroMap.set(bolt.id, !boltSzuroErtek);
        let vanBepipaltSzures = false;
        this.boltSzuroMap.forEach(value => {
            if (value) {
                vanBepipaltSzures = true;
            }
        });
        this.boltSzuresAktiv = vanBepipaltSzures;
        console.debug('AkcioListaComponent - boltSzuroKlikk: ', bolt, this.boltSzuroMap, this.boltSzuresAktiv, this.kivalasztottListaTetelei());
    }

    // késleltetett bevitel esetén minta megoldás
    // kereses(event: any): void {
    //     console.debug('AkcioListaComponent - kereses ', event);
    //     this.searchTerm.set(event);

    // }



}



