import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AkcioTetelIF } from './model/akcio-tetel.interface';
import { AkciosListaIF } from './model/akcios-lista.interface';
import { map } from 'rxjs';
import { AkciosLista } from './model/akcios-lista.type';
import { AkcioTetel } from './model/akcio-tetel.type';

@Injectable({
    providedIn: 'root'
})
export class AdatServiceService {

    public akciosListakLista = signal<AkciosLista[]>([]);
    public kivalasztottLista = signal<AkciosLista>(null);
    public akciosTetelLista = signal<AkcioTetel[]>([]);

    constructor(protected httpClient: HttpClient) { }

    akciosListakLekereseAlap(token: string) {
        return this.httpClient.get<AkciosListaIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosListak.json?auth=' + token, {
            observe: 'body',
            responseType: 'json'
        }).pipe(map(response => AkciosLista.convertFromIfList(response)));
    }

    akcioTetelekLekereseAlap(token: string) {
        return this.httpClient.get<AkcioTetelIF[]>('https://bevasarlolista-8247e.firebaseio.com/akciosTelelek.json?auth=' + token, {
            observe: 'body',
            responseType: 'json'
        }).pipe(map(response => AkcioTetel.convertFromIfList(response)));
    }

    aktulaisHetKivalasztasa(): void {
        const most = new Date();
        const ezAHet = this.akciosListakLista().find(value => value.kezdoNap <= most && value.vegeNap >= most);
        if (ezAHet) {
            this.kivalasztottLista.set(ezAHet);

        }
        console.debug('AdatServiceService - aktulaisHetKivalasztasa: ', this.kivalasztottLista());
    }
}
